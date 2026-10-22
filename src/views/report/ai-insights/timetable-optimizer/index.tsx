import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import TimetableWorkspace from './modals/TimetableWorkspace';
import TimetableModals from './modals/TimetableModals';
import type { TimetableModalId } from './modals/TimetableModals';
import {
  BLOCKING,
  CONFLICT_RESOURCES,
  CONFLICTS,
  COPILOT,
  DIMENSIONS,
  FINDINGS,
  gainOf,
  gridClashes,
  GRID_LEGEND,
  HEALTH_GAIN,
  INTELLIGENCE,
  LAST_RUN,
  LOAD_LEGEND,
  OPPORTUNITIES,
  OPTIMIZATION_CONFIDENCE,
  OPTIMIZED_HEALTH,
  PERIOD_ASSIGNMENTS,
  PERIODS_PER_DAY,
  priorityOf,
  RECOMMENDATIONS,
  RESOURCE_HEADLINE,
  RESOURCES,
  SCHEDULE_HEALTH,
  severityToneOf,
  TEACHING_DAYS,
  TERMS,
  timelineStops,
  weekCells,
} from './data/timetable.data';

/** A numbered section heading, in the template's own wording. */
const Mark = ({ n, title, note }: { n: string; title: string; note: string }) => (
  <>
    <div className="tto-mark">
      <span className="tto-mark-n">{n}</span>
      <h2 className="tto-mark-title">{title}</h2>
      <span className="tto-mark-rule" />
    </div>
    <p className="tto-mark-sub">{note}</p>
  </>
);

const AiTimetableOptimizer = () => {
  const routes = all_routes;
  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

  const [dialog, setDialog] = useState<TimetableModalId | null>(null);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [term, setTerm] = useState(TERMS[0]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [openFinding, setOpenFinding] = useState<string>(FINDINGS[0].id);

  const openDialog = useCallback((id: string) => setDialog(id as TimetableModalId), []);

  const cells = weekCells();
  const clashes = gridClashes();
  const timeline = timelineStops();

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-sparkles text-primary me-2" />
                AI Timetable Intelligence Center
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
                    Timetable Optimizer
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
                onClick={() => setWorkspaceOpen(true)}
              >
                <i className="ti ti-layout-sidebar-right-expand me-1" />
                Open Workspace
              </ActionLink>
            </div>
          </div>
          {/* /Page Header */}

          {/* Section 01 — the command centre */}
          <div className="tto-hero mb-5">
            <div className="tto-hero-inner">
              <div>
                <span className="tto-hero-badge">
                  <i className="ti ti-sparkles" />
                  Timetable Intelligence Engine
                </span>
                <h1 className="tto-hero-title">
                  {CONFLICTS.length} conflicts stand between this term and{' '}
                  <em>a publishable timetable</em>.
                </h1>
                <p className="fs-14 text-muted lh-base mb-0">
                  The engine evaluated {PERIOD_ASSIGNMENTS.toLocaleString('en-US')} period
                  assignments against teacher availability, room capacity, subject dependencies and
                  student load. Every proposed change is reversible and none is applied until you
                  approve it.
                </p>
                <div className="tto-hero-read">
                  <span className="tto-read">
                    <span className="tto-lbl">Schedule health</span>
                    <b>
                      {SCHEDULE_HEALTH}
                      <small>/100</small>
                    </b>
                  </span>
                  <span className="tto-read">
                    <span className="tto-lbl">Active conflicts</span>
                    <b>
                      {CONFLICTS.length}
                      <small> · {BLOCKING.length} critical</small>
                    </b>
                  </span>
                  <span className="tto-read">
                    <span className="tto-lbl">Optimization confidence</span>
                    <b>
                      {OPTIMIZATION_CONFIDENCE}
                      <small>%</small>
                    </b>
                  </span>
                  <span className="tto-read">
                    <span className="tto-lbl">Last optimization</span>
                    <b>{LAST_RUN} today</b>
                  </span>
                </div>
                <div className="d-flex align-items-center flex-wrap gap-3 mt-3">
                  <span className="tto-chip is-ai">
                    <i className="ti ti-circle-filled fs-6" />
                    Engine idle · ready to run
                  </span>
                  <span className="fs-12 text-muted">
                    Next scheduled pass in 4 hours ·{' '}
                    {PERIOD_ASSIGNMENTS.toLocaleString('en-US')} assignments in scope
                  </span>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-4">
                  <ActionLink
                    className="btn btn-primary d-inline-flex align-items-center"
                    onClick={() => setDialog('run_optimization')}
                  >
                    <i className="ti ti-player-play me-1" />
                    Run AI Optimization
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setWorkspaceOpen(true)}
                  >
                    <i className="ti ti-bulb me-1" />
                    Explain Optimization
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('generate_timetable')}
                  >
                    <i className="ti ti-sparkles me-1" />
                    Generate Smart Timetable
                  </ActionLink>
                </div>
              </div>

              <div className="tto-grid-art">
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <span className="tto-lbl">
                    Week at a glance · {TEACHING_DAYS} days × {PERIODS_PER_DAY} periods
                  </span>
                  <span className="tto-chip is-crit">
                    <i className="ti ti-alert-triangle" />
                    {clashes} clashes
                  </span>
                </div>
                <div className="tto-slots">
                  {cells.map((cell) => (
                    <i className={cell.state} key={cell.key} />
                  ))}
                </div>
                <div className="tto-legend">
                  {GRID_LEGEND.map((entry) => (
                    <span key={entry.state}>
                      <i className={entry.state} />
                      {entry.label}
                    </span>
                  ))}
                </div>
                <p className="fs-12 text-muted mb-0">
                  {RESOURCE_HEADLINE}. Resolving those two alone lifts schedule health by{' '}
                  {HEALTH_GAIN} points.
                </p>
              </div>
            </div>
          </div>

          {/* Section 02 — the six dimensions */}
          <Mark
            n="02"
            title="Optimization Workspace"
            note={`${DIMENSIONS.length} dimensions the engine optimizes, each with what it found now and what it reaches after the proposed changes.`}
          />

          <div className="row g-4 mb-5">
            {DIMENSIONS.map((row) => (
              <div className="col-xl-4 col-md-6" key={row.id}>
                <div className="tto-opt">
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <p className="tto-opt-title">{row.title}</p>
                    <span className="tto-chip is-warn">{row.verdict}</span>
                  </div>
                  <span className="tto-lbl mb-1">AI finding</span>
                  <p className="fs-13 text-muted mb-3">{row.finding}</p>

                  <div className="tto-vs">
                    <div>
                      <span className="tto-lbl mb-1">Current</span>
                      <span className={`tto-bar aix-p-${row.current}`} />
                      <b className="fs-14">{row.current}</b>
                    </div>
                    <div>
                      <span className="tto-lbl mb-1">Optimized</span>
                      <span className={`tto-bar is-ok aix-p-${row.optimized}`} />
                      <b className="fs-14">{row.optimized}</b>
                    </div>
                  </div>

                  <span className="tto-lbl mb-1">Suggested improvement</span>
                  <p className="fs-13 text-muted mb-3">{row.suggestion}</p>

                  <div className="tto-opt-foot">
                    <span className="tto-gain">
                      +{gainOf(row)} {row.impact}
                    </span>
                    <span className="tto-chip is-ai">
                      <i className="ti ti-sparkles" />
                      {row.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 03 — the findings */}
          <Mark
            n="03"
            title="Why the AI Recommends These Changes"
            note={`${FINDINGS.length} findings, in the order the engine ranked them. Open any one for the reasoning, the evidence and the fix.`}
          />

          <div className="tto-acc mb-5">
            {FINDINGS.map((finding) => {
              const isOpen = openFinding === finding.id;
              return (
                <div className="accordion-item" key={finding.id}>
                  <h2 className="accordion-header">
                    <button
                      type="button"
                      className={`accordion-button ${isOpen ? '' : 'collapsed'}`.trim()}
                      aria-expanded={isOpen}
                      onClick={() => setOpenFinding(isOpen ? '' : finding.id)}
                    >
                      <span className={`tto-acc-ic ${finding.tone}`}>
                        <i className={finding.icon} />
                      </span>
                      <span className="flex-fill">{finding.title}</span>
                      <span className={`tto-chip ${finding.tone} me-2 d-none d-md-inline-flex`}>
                        {finding.label}
                      </span>
                      <span className="tto-chip is-ai me-2 d-none d-lg-inline-flex">
                        <i className="ti ti-sparkles" />
                        {finding.confidence}%
                      </span>
                    </button>
                  </h2>
                  {isOpen ? (
                    <div className="accordion-collapse">
                      <div className="accordion-body">
                        <div className="row g-4">
                          <div className="col-12 col-lg-7">
                            <span className="tto-lbl mb-2">AI reasoning</span>
                            <p className="fs-13 text-muted lh-base mb-4">{finding.why}</p>
                            <span className="tto-lbl mb-2">Supporting evidence</span>
                            {finding.evidence.map((item) => (
                              <div className="tto-ev" key={item.label}>
                                <span>{item.label}</span>
                                <b>{item.value}</b>
                              </div>
                            ))}
                          </div>
                          <div className="col-12 col-lg-5">
                            <div className="tto-side">
                              <span className="tto-lbl mb-2">Before and after</span>
                              <div className="tto-ba">
                                {finding.before.map((item) => (
                                  <div className="tto-ba-row" key={item.label}>
                                    <span>{item.label}</span>
                                    <b>{item.value}</b>
                                  </div>
                                ))}
                              </div>
                              <div className="tto-fix">
                                <span className="tto-lbl mb-1">The fix</span>
                                <p className="fs-13 text-muted mb-3">{finding.fix}</p>
                                <ActionLink
                                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                                  onClick={() => setDialog('resolve_conflict')}
                                >
                                  <i className="ti ti-wand me-1" />
                                  Apply the fix
                                </ActionLink>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Section 04 — the conflicts */}
          <Mark
            n="04"
            title="Conflict Resolution Center"
            note={`Every active clash, shown as the two things that collide. ${CONFLICTS.length} conflicts, ${BLOCKING.length} of them blocking publication.`}
          />

          <div className="row g-4 mb-5">
            {CONFLICTS.map((row) => (
              <div className="col-xl-4 col-md-6" key={row.id}>
                <div className="tto-clash">
                  <div className="tto-clash-head">
                    <div className="flex-fill overflow-hidden">
                      <p className="fs-14 fw-medium text-dark mb-0 text-truncate">{row.subject}</p>
                      <p className="fs-12 text-muted mb-0">{row.where}</p>
                    </div>
                    <span className="tto-vs">vs</span>
                    <div className="flex-fill overflow-hidden text-end">
                      <p className="fs-13 text-dark mb-0 text-truncate">{row.against}</p>
                    </div>
                  </div>
                  <div className="tto-clash-body">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <span className="fs-13 fw-medium text-dark">{row.kind}</span>
                      <span className={`tto-chip ${severityToneOf(row.severity)}`}>
                        {row.severity}
                      </span>
                    </div>
                    <div className="tto-line">
                      <span>{row.ownerLabel}</span>
                      <b>{row.owner}</b>
                    </div>
                    <span className="tto-lbl mb-1">AI resolution</span>
                    <p className="fs-13 text-muted mb-0">{row.resolution}</p>
                  </div>
                  <div className="tto-clash-foot">
                    <span className="tto-gain">+{row.gain} health pts</span>
                    <span className="tto-chip is-ai">
                      <i className="ti ti-sparkles" />
                      {row.confidence}%
                    </span>
                    <ActionLink
                      className="btn btn-sm btn-primary ms-auto d-inline-flex align-items-center"
                      onClick={() => setDialog('resolve_conflict')}
                    >
                      <i className="ti ti-wand me-1" />
                      Resolve
                    </ActionLink>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 05 — the opportunities */}
          <Mark
            n="05"
            title="Optimization Opportunities"
            note="Gains available without resolving a single conflict, ranked by what each returns."
          />

          <div className="row g-4 mb-5">
            {OPPORTUNITIES.map((row) => (
              <div className="col-xl-3 col-md-6" key={row.id}>
                <div className="tto-opp">
                  <span className="tto-opp-ic">
                    <i className={row.icon} />
                  </span>
                  <span className="tto-opp-fig">
                    +{row.gain} {row.unit}
                  </span>
                  <p className="fs-14 fw-medium text-dark mb-1">{row.title}</p>
                  <p className="fs-12 text-muted mb-0">{row.note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section 06 — schedule intelligence */}
          <Mark
            n="06"
            title="Schedule Intelligence"
            note="What the engine noticed across the whole week that no single timetable view would show."
          />

          <div className="tto-feature mb-4">
            <div className="flex-fill">
              <span className="tto-lbl mb-1">Headline finding</span>
              <p className="tto-feature-fig mb-2">{RESOURCE_HEADLINE}</p>
              <p className="fs-13 text-muted mb-0">
                Every clash this term involves either {CONFLICT_RESOURCES.join(' or ')}. Fixing how
                those {CONFLICT_RESOURCES.length} are allocated would clear the entire conflict list
                without touching another period.
              </p>
            </div>
            <ActionLink
              className="btn btn-primary flex-shrink-0 d-inline-flex align-items-center"
              onClick={() => setWorkspaceOpen(true)}
            >
              <i className="ti ti-layout-sidebar-right-expand me-1" />
              Open workspace
            </ActionLink>
          </div>

          <div className="row g-4 mb-5">
            {INTELLIGENCE.map((entry) => (
              <div className="col-xl-4 col-md-6" key={entry.id}>
                <div className="tto-note">
                  <p className="tto-note-title">{entry.title}</p>
                  <p className="fs-13 text-muted mb-0">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section 07 — the copilot */}
          <Mark
            n="07"
            title="Scheduling Copilot"
            note={`${COPILOT.length} things the copilot can build from the current draft. Everything arrives as a draft for review.`}
          />

          <div className="row g-3 mb-5">
            {COPILOT.map((entry) => (
              <div className="col-xl-4 col-md-6" key={entry.key}>
                <ActionLink className="tto-do" onClick={() => openDialog(entry.modal)}>
                  <span className="tto-do-ic">{entry.key}</span>
                  <span className="flex-fill overflow-hidden">
                    <span className="d-block fs-14 fw-medium text-dark">{entry.title}</span>
                    <span className="d-block fs-12 text-muted">{entry.note}</span>
                  </span>
                </ActionLink>
              </div>
            ))}
          </div>

          {/* Section 08 — the timeline */}
          <Mark
            n="08"
            title="Optimization Timeline"
            note="Where this term's timetable sits between the first draft and publication."
          />

          <div className="card mb-5">
            <div className="card-body">
              {timeline.map((stop) => (
                <div className={`tto-stop ${stop.done ? 'is-done' : ''}`.trim()} key={stop.id}>
                  <span className="tto-stop-ic">
                    <i className={stop.icon} />
                  </span>
                  <div className="tto-stop-card">
                    <p className="tto-stop-title">{stop.title}</p>
                    <p className="fs-12 text-muted mb-1">
                      {stop.on === 'Pending' ? 'Pending' : stop.on.split(' ').slice(0, 2).join(' ')}
                    </p>
                    <p className="fs-13 text-muted mb-0">{stop.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 09 — the resources */}
          <Mark
            n="09"
            title="Resource Intelligence"
            note={`Every shared resource across the ${PERIODS_PER_DAY} teaching periods. Each strip runs period one to period ${PERIODS_PER_DAY}, left to right.`}
          />

          <div className="card mb-5">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                <span className="tto-lbl">Resource · load across periods 1 to {PERIODS_PER_DAY}</span>
                <div className="tto-legend">
                  {LOAD_LEGEND.map((entry) => (
                    <span key={entry.level}>
                      <i className={`l${entry.level}`} />
                      {entry.label}
                    </span>
                  ))}
                </div>
              </div>
              {RESOURCES.map((resource) => (
                <div className="tto-res" key={resource.id}>
                  <div className="tto-res-name">
                    <p className="fs-13 fw-medium text-dark mb-0">{resource.name}</p>
                    <p className="fs-12 text-muted mb-0">{resource.scale}</p>
                  </div>
                  <div className="tto-track">
                    {resource.load.map((level, index) => (
                      <span className={`tto-strip l${level}`} key={`${resource.id}-p${index + 1}`} />
                    ))}
                  </div>
                  <span className="tto-chip is-info flex-shrink-0">{resource.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 10 — the ranked plan */}
          <Mark
            n="10"
            title="Smart Recommendation Center"
            note={`The engine's ranked plan. Applying the first two clears both blocking conflicts and lifts schedule health from ${SCHEDULE_HEALTH} to ${OPTIMIZED_HEALTH}.`}
          />

          <div className="row g-4 mb-4">
            {RECOMMENDATIONS.map((entry, index) => {
              const priority = priorityOf(index + 1);
              return (
                <div className="col-12 col-xl-6" key={entry.id}>
                  <div className="tto-rec">
                    <div className="tto-rec-head">
                      <span className="tto-rec-rank">{String(index + 1).padStart(2, '0')}</span>
                      <p className="tto-rec-title">{entry.title}</p>
                      <span className={`tto-chip ${priority.tone} ms-auto`}>{priority.band}</span>
                    </div>
                    <div className="tto-rec-body">
                      <p className="fs-13 text-muted mb-0">{entry.note}</p>
                    </div>
                    <div className="tto-rec-grid">
                      <span className="tto-cell">
                        <span className="tto-lbl">Confidence</span>
                        <span>{entry.confidence}%</span>
                      </span>
                      <span className="tto-cell">
                        <span className="tto-lbl">Benefit</span>
                        <span>{entry.benefit}</span>
                      </span>
                      <span className="tto-cell">
                        <span className="tto-lbl">Periods moved</span>
                        <span>{entry.effort}</span>
                      </span>
                      <span className="tto-cell">
                        <span className="tto-lbl">Timeline</span>
                        <span>{entry.timeline}</span>
                      </span>
                    </div>
                    <ActionLink
                      className="btn btn-sm btn-primary d-inline-flex align-items-center"
                      onClick={() => openDialog(entry.modal)}
                    >
                      <i className="ti ti-bolt me-1" />
                      Apply Recommendation
                    </ActionLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <TimetableWorkspace
        open={workspaceOpen}
        onClose={() => setWorkspaceOpen(false)}
        onOpenDialog={openDialog}
      />

      <TimetableModals active={dialog} onClose={() => setDialog(null)} onToast={pushToast} />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default AiTimetableOptimizer;
