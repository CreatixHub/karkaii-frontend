import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import HubModals from './modals/HubModals';
import type { HubModalId } from './modals/HubModals';
import {
  AGENTS,
  AGENTS_RUNNING,
  agentToneOf,
  AUTOMATIONS,
  automationToneOf,
  AWAITING_APPROVAL,
  CONSOLE,
  healthOf,
  KNOWLEDGE,
  LAUNCHER,
  MEAN_CONFIDENCE,
  MISSIONS,
  MISSIONS_DONE,
  MISSIONS_TODAY,
  missionToneOf,
  pipeline,
  ROADMAP,
  SERVICES,
  SERVICES_ONLINE,
  stageToneOf,
  stateToneOf,
  TERMS,
} from './data/hub.data';

const AiCommandCenter = () => {
  const routes = all_routes;
  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

  const [dialog, setDialog] = useState<HubModalId | null>(null);
  const [term, setTerm] = useState(TERMS[0]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const openDialog = useCallback((id: string) => setDialog(id as HubModalId), []);
  const steps = pipeline();

  const routeFor = (key: string) => (all_routes as Record<string, string>)[key] ?? routes.aiCommandCenter;

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-sparkles text-primary me-2" />
                AI Command Center
              </h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    AI Command Center
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
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2"
                onClick={() => setDialog('ai_settings')}
              >
                <i className="ti ti-settings me-1" />
                AI Settings
              </button>
              <ActionLink
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => setDialog('launch_service')}
              >
                <i className="ti ti-player-play me-1" />
                Launch AI Analysis
              </ActionLink>
            </div>
          </div>
          {/* /Page Header */}

          {/* Section 01 — mission control */}
          <div className="ops-mission mb-5">
            <span className="ops-orb" />
            <div className="ops-mission-inner">
              <div>
                <span className="ops-mission-badge">
                  <span className="ops-dot is-live" />
                  Preskool AI · Operating System
                </span>
                <h1 className="ops-mission-title">
                  {SERVICES.length} intelligences. One console.
                </h1>
                <p className="ops-mission-lead">
                  Attendance, risk, teaching, homework, revenue, families, scheduling and reporting
                  — all run from here. The engine reasons on its own, but never acts without you:{' '}
                  {AWAITING_APPROVAL} recommendations are waiting for a person right now.
                </p>

                <div className="ops-rail">
                  <span className="ops-rail-cell">
                    <span className="ops-lbl">AI services online</span>
                    <b>
                      {SERVICES_ONLINE} / {SERVICES.length}
                    </b>
                  </span>
                  <span className="ops-rail-cell">
                    <span className="ops-lbl">Active AI agents</span>
                    <b>{AGENTS_RUNNING} running</b>
                  </span>
                  <span className="ops-rail-cell">
                    <span className="ops-lbl">Intelligence status</span>
                    <b>Nominal</b>
                  </span>
                  <span className="ops-rail-cell">
                    <span className="ops-lbl">Today’s AI missions</span>
                    <b>
                      {MISSIONS_DONE} of {MISSIONS_TODAY}
                    </b>
                  </span>
                  <span className="ops-rail-cell">
                    <span className="ops-lbl">Mean confidence</span>
                    <b>{MEAN_CONFIDENCE}%</b>
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  <ActionLink
                    className="btn btn-primary d-inline-flex align-items-center"
                    onClick={() => setDialog('launch_service')}
                  >
                    <i className="ti ti-player-play me-1" />
                    Launch AI Analysis
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('configure_analysis')}
                  >
                    <i className="ti ti-adjustments me-1" />
                    Configure Analysis
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('executive_summary')}
                  >
                    <i className="ti ti-file-text me-1" />
                    Generate Insights
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('ai_settings')}
                  >
                    <i className="ti ti-settings me-1" />
                    AI Settings
                  </ActionLink>
                </div>
              </div>

              <div className="ops-glass">
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <span className="ops-lbl">Today’s missions</span>
                  <span className="ops-chip is-live">
                    <span className="ops-dot is-live" />
                    Live
                  </span>
                </div>
                {MISSIONS.map((mission) => (
                  <div className="ops-mission-row" key={mission.id}>
                    <span className={`ops-mission-ic ${missionToneOf(mission.state)}`}>
                      <i className="ti ti-point-filled" />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <p className="fs-13 fw-medium text-dark mb-0 text-truncate">
                        {mission.title}
                      </p>
                      <p className="fs-12 text-muted mb-0">{mission.note}</p>
                    </div>
                    <span className="fs-12 text-muted flex-shrink-0">{mission.at}</span>
                  </div>
                ))}
                <ActionLink
                  className="btn btn-sm btn-outline-light bg-white w-100 mt-2 d-inline-flex align-items-center justify-content-center"
                  onClick={() => setDialog('export_intelligence')}
                >
                  <i className="ti ti-file-export me-1" />
                  Export the run
                </ActionLink>
              </div>
            </div>
          </div>

          {/* Section 02 — the nine */}
          <div className="ops-hd">
            <span className="ops-eyebrow">Capability</span>
            <h2 className="ops-hd-title">AI Capability Hub</h2>
            <p className="ops-hd-sub">
              The {SERVICES.length} intelligences, each showing what it holds right now. Every
              figure here is read from the application that owns it.
            </p>
          </div>

          <div className="ops-bento mb-5">
            {SERVICES.map((service) => (
              <div
                className={`ops-tile ops-span-2 ${service.feature ? 'is-feature' : ''}`.trim()}
                key={service.id}
              >
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <span className="ops-tile-ic">
                    <i className={service.icon} />
                  </span>
                  <span className={`ops-chip ${stateToneOf(service.state)}`}>
                    <span className={`ops-dot ${stateToneOf(service.state)}`} />
                    {service.state}
                  </span>
                </div>
                <p className="ops-tile-title">{service.name}</p>
                <span className="ops-tile-fig">{service.figure}</span>
                <p className="ops-tile-lead">{service.metric}</p>
                <p className="fs-12 text-muted mb-0">{service.summary}</p>
                <div className="ops-tile-foot">
                  <div className="flex-fill">
                    <span className="ops-lbl">Health</span>
                    <span className={`ops-health aix-p-${healthOf(service)}`} />
                  </div>
                  <Link
                    to={routeFor(service.routeKey)}
                    className="btn btn-sm btn-outline-light bg-white flex-shrink-0 d-inline-flex align-items-center"
                  >
                    <i className="ti ti-arrow-right me-1" />
                    Quick launch
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Section 03 — the launcher */}
          <div className="ops-hd">
            <span className="ops-eyebrow">Launch</span>
            <h2 className="ops-hd-title">AI Workspace Launcher</h2>
            <p className="ops-hd-sub">
              The {LAUNCHER.length} things teams start here most often. Each opens the application
              that owns it.
            </p>
          </div>

          <div className="row g-3 mb-5">
            {LAUNCHER.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.id}>
                <Link to={routeFor(entry.routeKey)} className="ops-launch">
                  <span className="ops-launch-ic">
                    <i className={entry.icon} />
                  </span>
                  <span className="flex-fill overflow-hidden">
                    <span className="ops-launch-title d-block">{entry.title}</span>
                    <span className="d-block fs-12 text-muted">{entry.note}</span>
                  </span>
                  <i className="ti ti-arrow-right ops-launch-go" />
                </Link>
              </div>
            ))}
          </div>

          {/* Section 04 — live operations */}
          <div className="ops-hd">
            <span className="ops-eyebrow">Operations</span>
            <h2 className="ops-hd-title">Live AI Operations</h2>
            <p className="ops-hd-sub">
              Everything the platform has done since the overnight sweep began, newest first.
            </p>
          </div>

          <div className="card mb-5">
            <div className="card-body">
              {MISSIONS.map((mission) => (
                <div className="ops-op" key={mission.id}>
                  <span className={`ops-op-ic ${missionToneOf(mission.state)}`}>
                    <i className="ti ti-activity" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <p className="ops-op-title mb-0">{mission.title}</p>
                      <span className={`ops-chip ${missionToneOf(mission.state)}`}>
                        {mission.state}
                      </span>
                      <span className="fs-12 text-muted ms-auto">{mission.at}</span>
                    </div>
                    <p className="fs-13 text-muted mb-0">{mission.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 05 — the pipeline */}
          <div className="ops-hd">
            <span className="ops-eyebrow">Pipeline</span>
            <h2 className="ops-hd-title">How Intelligence Is Produced</h2>
            <p className="ops-hd-sub">
              Every finding on the platform passes these {steps.length} steps. Nothing skips the
              approval gate.
            </p>
          </div>

          <div className="card mb-5">
            <div className="card-body">
              <div className="ops-pipe">
                {steps.map((step) => (
                  <div className={`ops-stage ${step.gate ? 'is-gate' : ''}`.trim()} key={step.step}>
                    <span className="ops-stage-n">{step.step}</span>
                    <div className="flex-fill overflow-hidden">
                      <p className="ops-stage-title">{step.name}</p>
                      <p className="fs-12 text-muted mb-0">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="ops-quote mt-4">
                <i className="ti ti-hand-stop me-2" />
                The pipeline stops at Recommend Actions by design. {AWAITING_APPROVAL}{' '}
                recommendations are waiting for a person to approve them; none has been acted on,
                sent or written to a student record.
              </div>
            </div>
          </div>

          {/* Section 06 — automations */}
          <div className="ops-hd">
            <span className="ops-eyebrow">Automation</span>
            <h2 className="ops-hd-title">AI Automation Center</h2>
            <p className="ops-hd-sub">
              {AUTOMATIONS.length} routines running on a schedule. Each can be paused, re-timed or
              cloned without touching the others.
            </p>
            <ActionLink
              className="btn btn-sm btn-outline-light bg-white ms-auto d-inline-flex align-items-center"
              onClick={() => setDialog('create_automation')}
            >
              <i className="ti ti-plus me-1" />
              New automation
            </ActionLink>
          </div>

          <div className="row g-4 mb-5">
            {AUTOMATIONS.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.id}>
                <div className="ops-auto">
                  <div className="ops-auto-head">
                    <p className="ops-auto-title">{entry.name}</p>
                    <span className={`ops-chip ${automationToneOf(entry.state)}`}>
                      <span className={`ops-dot ${automationToneOf(entry.state)}`} />
                      {entry.state}
                    </span>
                  </div>
                  <div className="ops-auto-body">
                    <div className="ops-kv">
                      <span>Next run</span>
                      <b>{entry.nextRun}</b>
                    </div>
                    <div className="ops-kv">
                      <span>Last run</span>
                      <b>{entry.lastRun}</b>
                    </div>
                    <div>
                      <span className="ops-lbl">Health</span>
                      <span className={`ops-health aix-p-${entry.health}`} />
                    </div>
                    <ActionLink
                      className="btn btn-sm btn-outline-light bg-white w-100 mt-2 d-inline-flex align-items-center justify-content-center"
                      onClick={() => setDialog('schedule_automation')}
                    >
                      <i className="ti ti-adjustments me-1" />
                      Configure
                    </ActionLink>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 07 — the agents */}
          <div className="ops-hd">
            <span className="ops-eyebrow">Agents</span>
            <h2 className="ops-hd-title">AI Agent Gallery</h2>
            <p className="ops-hd-sub">
              {AGENTS.length} agents, each with a defined purpose and a defined boundary. The
              medical agent reads absence patterns and never the notes behind them.
            </p>
          </div>

          <div className="row g-4 mb-5">
            {AGENTS.map((agent) => (
              <div className="col-xl-4 col-md-6" key={agent.id}>
                <div className="ops-agent">
                  <div className="d-flex align-items-center gap-3">
                    <span className="ops-agent-ic">
                      <i className={agent.icon} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <p className="ops-agent-name">{agent.name}</p>
                      <span className={`ops-chip ${agentToneOf(agent.state)}`}>
                        <span className={`ops-dot ${agentToneOf(agent.state)}`} />
                        {agent.state}
                      </span>
                    </div>
                  </div>
                  <p className="fs-13 text-muted mb-0 mt-3">{agent.purpose}</p>
                  <div className="ops-caps">
                    {agent.capabilities.map((capability) => (
                      <span key={capability}>{capability}</span>
                    ))}
                  </div>
                  <div className="ops-agent-foot">
                    <ActionLink
                      className="btn btn-sm btn-outline-light bg-white w-100 d-inline-flex align-items-center justify-content-center"
                      onClick={() =>
                        agent.state === 'Restricted'
                          ? pushToast(
                              `${agent.name} runs under a restricted scope and cannot be launched from here.`,
                              'warning',
                            )
                          : setDialog('launch_service')
                      }
                    >
                      <i className="ti ti-player-play me-1" />
                      Launch
                    </ActionLink>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 08 — the knowledge centre */}
          <div className="ops-hd">
            <span className="ops-eyebrow">Knowledge</span>
            <h2 className="ops-hd-title">AI Knowledge Center</h2>
            <p className="ops-hd-sub">
              The templates, rules and history behind everything the platform produces.
            </p>
          </div>

          <div className="row g-3 mb-5">
            {KNOWLEDGE.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.id}>
                <ActionLink
                  className="ops-know"
                  onClick={() => pushToast(`${entry.title} opens from AI settings.`, 'info')}
                >
                  <span className="ops-know-ic">
                    <i className={entry.icon} />
                  </span>
                  <span className="flex-fill overflow-hidden">
                    <span className="ops-know-title d-block">{entry.title}</span>
                    <span className="d-block fs-12 text-muted">{entry.note}</span>
                  </span>
                  <span className="ops-know-n">{entry.figure}</span>
                </ActionLink>
              </div>
            ))}
          </div>

          {/* Section 09 — the console */}
          <div className="ops-hd">
            <span className="ops-eyebrow">Copilot</span>
            <h2 className="ops-hd-title">AI Command Console</h2>
            <p className="ops-hd-sub">
              {CONSOLE.length} whole-school routines. Everything they produce arrives as a draft for
              a named approver.
            </p>
          </div>

          <div className="ops-console mb-5">
            <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
              <div>
                <p className="fs-14 fw-medium text-dark mb-0">Command console</p>
                <p className="fs-12 text-muted mb-0">
                  Run the whole school in one pass · nothing is sent without approval
                </p>
              </div>
              <span className="ops-chip is-live">
                <span className="ops-dot is-live" />
                Ready
              </span>
            </div>
            <div className="row g-3">
              {CONSOLE.map((entry) => (
                <div className="col-xl-4 col-md-6" key={entry.key}>
                  <ActionLink className="ops-cmd" onClick={() => openDialog(entry.modal)}>
                    <span className="ops-cmd-ic">
                      <i className="ti ti-terminal-2" />
                    </span>
                    <span className="flex-fill overflow-hidden">
                      <span className="ops-cmd-title d-block">{entry.title}</span>
                      <span className="d-block fs-12 text-muted">{entry.note}</span>
                    </span>
                    <span className="ops-kbd">{entry.key}</span>
                  </ActionLink>
                </div>
              ))}
            </div>
            <div className="ops-empty mt-4">
              <span className="ops-empty-ic">
                <i className="ti ti-inbox" />
              </span>
              <div>
                <p className="fs-14 fw-medium text-dark mb-1">No drafts awaiting your approval</p>
                <p className="fs-13 text-muted mb-0">
                  Anything the console produces waits here until you release it. The platform has
                  never sent a message, changed a balance or written to a student record on its own.
                </p>
              </div>
            </div>
          </div>

          {/* Section 10 — the roadmap */}
          <div className="ops-hd">
            <span className="ops-eyebrow">Roadmap</span>
            <h2 className="ops-hd-title">AI Innovation Showcase</h2>
            <p className="ops-hd-sub">
              What arrived this release, what is coming next, and what is still being tested.
            </p>
          </div>

          <div className="row g-4 mb-4">
            {ROADMAP.map((entry) => (
              <div className="col-xl-4 col-md-6" key={entry.id}>
                <div className="ops-new">
                  <div className="d-flex align-items-center gap-2">
                    <span className="ops-new-ic">
                      <i className="ti ti-sparkles" />
                    </span>
                    <span className={`ops-chip ${stageToneOf(entry.stage)}`}>{entry.stage}</span>
                  </div>
                  <p className="ops-new-title">{entry.title}</p>
                  <p className="fs-13 text-muted mb-0">{entry.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <HubModals active={dialog} onClose={() => setDialog(null)} onToast={pushToast} />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default AiCommandCenter;
