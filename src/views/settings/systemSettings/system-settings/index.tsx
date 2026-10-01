import { Fragment, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { useToasts } from '@hooks/useToasts';
import DiskBar from './components/DiskBar';
import SystemCard from './components/SystemCard';
import SystemWorkspace from './components/SystemWorkspace';
import SystemSettingsModals, { type SystemDialog } from './modals/SystemSettingsModals';
import type { SectionId } from './data/systemSettings.data';
import {
  adviceTone,
  API_KEYS,
  AUDIT,
  AUDIT_TOTAL,
  AVAILABILITY,
  AVAILABILITY_NOTE,
  AVAILABLE_VERSION,
  BACKUPS,
  backupTone,
  CACHE_ADVICE,
  CACHE_STORES,
  CACHE_WARNING,
  CONSOLE_COMMANDS,
  DISK_ALERT_AT,
  DISK_PERCENT,
  DRAFTS,
  ENDPOINTS,
  ENV_VARS,
  FAILED_JOBS,
  FREE_GB,
  HEALTH,
  HEALTH_FAILING,
  HEALTH_INTERVAL,
  HEALTH_PASSING,
  hitRateLabel,
  INSTALLATION,
  JOBS,
  jobTone,
  keyOverdue,
  LAST_FULL_CLEAR,
  LAST_SCAN,
  ledTone,
  LOG,
  LOG_CHIPS,
  LOG_FOOT,
  LOG_RETENTION_DAYS,
  LOG_TOTAL,
  logTone,
  MAINTENANCE_OFF_NOTE,
  MANUAL_ACTIONS,
  MEASURED_AT,
  navTone,
  NEEDS_ATTENTION,
  OPERATIONAL,
  QUEUE_DEPTH,
  RECOMMENDATIONS,
  RELEASED_ON,
  RESOURCES,
  RUNTIME,
  RUNTIME_COMMAND,
  runtimeLine,
  SCANS,
  SECTIONS,
  sectionNumber,
  SERVICES,
  serviceTone,
  storeTone,
  stripOf,
  TIMELINE,
  UPGRADE_NOTES,
  UPGRADE_WINDOW,
  UPTIME_DAYS,
  USED_GB,
  USERS,
  VOLUME_GB,
  VOLUME_PATH,
  WORKERS_RESPONDING,
  WORKERS_TOTAL,
} from './data/systemSettings.data';
import {
  ALERTING_CARD,
  API_CARD,
  API_KEYS_CARD,
  APPLICATION_CARDS,
  BACKUP_CARDS,
  CACHE_CARD,
  ENVIRONMENTS_CARD,
  EXPERIMENTAL_CARD,
  FLAGS_FOOT,
  GENERAL_CARDS,
  INFRASTRUCTURE_CARD,
  INTEGRATIONS_CARD,
  JOB_FAILURE_CARD,
  LICENCE_CARDS,
  LOGGING_CARDS,
  MAINTENANCE_CARDS,
  PERFORMANCE_CARDS,
  SECURITY_CARDS,
  STORAGE_CARDS,
  UPDATE_POLICY_CARD,
  VERSION_CARD,
  WEBHOOKS_CARD,
} from './data/cards.data';

/** The heading every section opens with — its number, name and lead line. */
const SectionHead = ({ id }: { id: SectionId }) => {
  const section = SECTIONS.find((entry) => entry.id === id);
  if (!section) return null;

  return (
    <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
      <div>
        <span className="sys-lbl">Section {sectionNumber(id)}</span>
        <h2 className="sys-hero-title fs-20 mb-1">{section.title}</h2>
        <p className="fs-13 text-muted mb-0">{section.lead}</p>
      </div>
    </div>
  );
};

const SystemSettings = () => {
  const { toasts, push, dismiss } = useToasts();

  const [section, setSection] = useState<SectionId>('general');
  const [dialog, setDialog] = useState<SystemDialog>(null);
  const [workspace, setWorkspace] = useState<string | null>(null);

  const openWorkspace = (subject: string) => setWorkspace(subject);
  const pane = (id: SectionId) => `tab-pane fade${section === id ? ' show active' : ''}`;

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* System Workspace Hero */}
          <div className="sys-hero">
            <div className="sys-ribbon">
              <strong>
                <i className="ti ti-cloud-check" />
                {INSTALLATION.environment}
              </strong>
              <span className="sys-ribbon-sep" />
              <span>
                Region <b>{INSTALLATION.region}</b>
              </span>
              <span className="sys-ribbon-sep" />
              <span>
                Host <b>{INSTALLATION.host}</b>
              </span>
              <span className="sys-ribbon-sep" />
              <span>
                Uptime <b>{INSTALLATION.uptimeDays} days</b>
              </span>
              <span className="sys-ribbon-sep" />
              <span>
                Build <b>{INSTALLATION.build}</b>
              </span>
            </div>
            <div className="sys-hero-body">
              <div className="sys-hero-top">
                <span className="sys-hero-crest">
                  <i className="ti ti-server-cog" />
                </span>
                <div className="flex-fill">
                  <h1 className="sys-hero-title">System Settings</h1>
                  <p className="sys-hero-sub">
                    Everything the platform runs on — services, performance, storage, maintenance,
                    APIs and backups. Changes here reach every school on this installation, not one.
                  </p>
                </div>
                <span className="sys-badge is-warn">
                  <i className="ti ti-alert-circle" />
                  {NEEDS_ATTENTION} items need attention
                </span>
              </div>
              <div className="sys-hero-grid">
                <div className="sys-hero-cell">
                  <span>Platform version</span>
                  <strong>
                    {INSTALLATION.version}{' '}
                    <span className="sys-badge is-warn">{AVAILABLE_VERSION} available</span>
                  </strong>
                </div>
                <div className="sys-hero-cell">
                  <span>Environment</span>
                  <strong>
                    <span className="sys-led" />
                    {INSTALLATION.environment}
                  </strong>
                </div>
                <div className="sys-hero-cell">
                  <span>System status</span>
                  <strong>
                    Operational · {OPERATIONAL} of {SERVICES.length} services
                  </strong>
                </div>
                <div className="sys-hero-cell">
                  <span>Configuration</span>
                  <strong>
                    Published <span className="sys-badge is-accent">{DRAFTS} drafts</span>
                  </strong>
                </div>
                <div className="sys-hero-cell">
                  <span>Last update</span>
                  <strong>{INSTALLATION.lastUpdate}</strong>
                </div>
                <div className="sys-hero-cell">
                  <span>Disk</span>
                  <strong>
                    {USED_GB} GB of {VOLUME_GB} GB used
                  </strong>
                </div>
              </div>
              <div className="sys-hero-actions">
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center"
                  onClick={() => setDialog('edit')}
                >
                  <i className="ti ti-device-floppy me-1" />
                  Save changes
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => setDialog('publish')}
                >
                  <i className="ti ti-rocket me-1" />
                  Publish configuration
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => setDialog('backup')}
                >
                  <i className="ti ti-archive me-1" />
                  Backup settings
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => setSection('audit')}
                >
                  <i className="ti ti-file-search me-1" />
                  View audit logs
                </button>
              </div>
            </div>
          </div>
          {/* /System Workspace Hero */}

          <div className="row g-4">
            {/* Sticky settings navigation */}
            <div className="col-xxl-3 col-lg-4">
              <div className="sys-nav nav flex-column" role="tablist" aria-label="System settings sections">
                {SECTIONS.map((entry) => (
                  <Fragment key={entry.id}>
                    {entry.group ? <span className="sys-nav-hdr">{entry.group}</span> : null}
                    <button
                      className={`sys-nav-link${section === entry.id ? ' active' : ''}`}
                      id={`systab-${entry.id}`}
                      type="button"
                      role="tab"
                      aria-controls={`syspane-${entry.id}`}
                      aria-selected={section === entry.id}
                      onClick={() => setSection(entry.id)}
                    >
                      <i className={entry.icon} />
                      <span className="sys-nav-txt">{entry.label}</span>
                      <span className={`sys-led ${navTone(entry.id)}`.trim()} />
                    </button>
                  </Fragment>
                ))}

                <div className="sys-nav-foot">
                  <span className="sys-lbl">Resources</span>
                  <div className="d-flex flex-column gap-2 mb-3">
                    {RESOURCES.map((gauge) => (
                      <Fragment key={gauge.id}>
                        <span className="fs-12 text-muted">{gauge.label}</span>
                        <span className={`sys-gauge ${gauge.tone}`.trim()}>
                          <span className={`sys-gauge-track sys-p-${gauge.percent}`}>
                            <span />
                          </span>
                          <span className="sys-gauge-n">{gauge.percent}%</span>
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm w-100 d-inline-flex align-items-center justify-content-center"
                    onClick={() => setDialog('export')}
                  >
                    <i className="ti ti-download me-1" />
                    Export configuration
                  </ActionLink>
                </div>
              </div>
            </div>
            {/* /Sticky Settings Navigation */}

            <div className="col-xxl-9 col-lg-8">
              <div className="tab-content">
                {/* 01 General */}
                <div className={pane('general')} id="syspane-general" role="tabpanel">
                  <SectionHead id="general" />
                  <div className="row g-4">
                    {GENERAL_CARDS.map((card) => (
                      <SystemCard key={card.id} card={card} onOpen={openWorkspace} />
                    ))}
                  </div>
                </div>

                {/* 02 Application */}
                <div className={pane('application')} id="syspane-application" role="tabpanel">
                  <SectionHead id="application" />
                  <div className="row g-4">
                    {APPLICATION_CARDS.map((card) => (
                      <SystemCard
                        key={card.id}
                        card={card}
                        foot={card.id === 'flags' ? FLAGS_FOOT : undefined}
                        onOpen={openWorkspace}
                      />
                    ))}
                  </div>
                </div>

                {/* 03 Platform services */}
                <div className={pane('platform')} id="syspane-platform" role="tabpanel">
                  <SectionHead id="platform" />
                  <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                    <p className="fs-13 text-muted mb-0">
                      {SERVICES.length} services, each showing {UPTIME_DAYS} days of history. The
                      strip matters more than the percentage — four consecutive red days is a
                      different problem from four scattered ones.
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                      onClick={() => setDialog('services')}
                    >
                      <i className="ti ti-settings me-1" />
                      Configure services
                    </button>
                  </div>
                  <div className="row g-4">
                    {SERVICES.map((service) => (
                      <div className="col-xxl-3 col-lg-4 col-md-6" key={service.id}>
                        <div className={`sys-svc ${ledTone(service.state)}`.trim()}>
                          <div className="sys-svc-top">
                            <span className="sys-svc-ic">
                              <i className={service.icon} />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <p className="sys-svc-name">
                                <span className={`sys-led ${ledTone(service.state)}`.trim()} />
                                {service.name}
                              </p>
                              <p>{service.note}</p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className={`sys-badge ${serviceTone(service.state)}`}>
                              {service.state}
                            </span>
                            <span className="sys-ver">{service.version}</span>
                          </div>
                          <div>
                            <div className="sys-uptime">
                              {stripOf(service).map((day) => (
                                <i className={day.level} key={day.day} />
                              ))}
                            </div>
                            <div className="sys-uptime-meta">
                              <span>{UPTIME_DAYS} days</span>
                              <span>
                                <b>{service.uptime}</b> uptime
                              </span>
                            </div>
                          </div>
                          <div className="sys-svc-foot">
                            <span className="fs-12 text-muted">{service.restarted}</span>
                            <ActionLink
                              className="btn btn-sm btn-outline-light bg-white"
                              ariaLabel={`Open system configuration workspace for ${service.name}`}
                              onClick={() => openWorkspace(service.name)}
                            >
                              Configure
                            </ActionLink>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 04 Performance */}
                <div className={pane('performance')} id="syspane-performance" role="tabpanel">
                  <SectionHead id="performance" />
                  <div className="row g-4">
                    {PERFORMANCE_CARDS.map((card) => (
                      <SystemCard key={card.id} card={card} onOpen={openWorkspace} />
                    ))}
                  </div>
                </div>

                {/* 05 Storage */}
                <div className={pane('storage')} id="syspane-storage" role="tabpanel">
                  <SectionHead id="storage" />
                  <div className="row g-4">
                    <div className="col-xl-6">
                      <div className="sys-card">
                        <div className="sys-card-head">
                          <span className="sys-card-ic">
                            <i className="ti ti-database" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="sys-card-title">Volume · {VOLUME_PATH}</p>
                            <p>
                              {USED_GB} GB of {VOLUME_GB} GB used · {FREE_GB} GB free
                            </p>
                          </div>
                          <span className="sys-badge is-warn">
                            {DISK_PERCENT}% — alert at {DISK_ALERT_AT}%
                          </span>
                        </div>
                        <div className="sys-card-body">
                          <DiskBar advice className="mt-2" />
                        </div>
                        <div className="sys-card-foot">
                          <span className="fs-12 text-muted">{MEASURED_AT}</span>
                          <ActionLink
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                            ariaLabel="Open system configuration workspace for Disk usage"
                            onClick={() => openWorkspace('Disk usage')}
                          >
                            <i className="ti ti-arrow-right me-1" />
                            Open
                          </ActionLink>
                        </div>
                      </div>
                    </div>

                    {STORAGE_CARDS.map((card) => (
                      <SystemCard key={card.id} card={card} onOpen={openWorkspace} />
                    ))}
                  </div>
                </div>

                {/* 06 Cache */}
                <div className={pane('cache')} id="syspane-cache" role="tabpanel">
                  <SectionHead id="cache" />
                  <div className="row g-4">
                    <SystemCard card={CACHE_CARD} onOpen={openWorkspace} />

                    <div className="col-12 col-xl-6">
                      <div className="sys-card">
                        <div className="sys-card-head">
                          <span className="sys-card-ic is-warn">
                            <i className="ti ti-eraser" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="sys-card-title">Clearing the cache</p>
                            <p>What it costs to do it</p>
                          </div>
                          <span className="sys-badge is-warn">Use sparingly</span>
                        </div>
                        <div className="sys-card-body">
                          <p className="fs-12 text-muted">{CACHE_WARNING}</p>
                          {CACHE_ADVICE.map((entry) => (
                            <div className="sys-check" key={entry.id}>
                              <i className="ti ti-circle-check" />
                              <div>
                                {entry.title}
                                <span>{entry.detail}</span>
                              </div>
                            </div>
                          ))}
                          <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
                            <ActionLink
                              className="btn btn-sm btn-outline-light bg-white"
                              onClick={() => openWorkspace('Cache stores')}
                            >
                              Clear one store
                            </ActionLink>
                            <ActionLink
                              className="btn btn-sm btn-danger"
                              onClick={() => push('Every cache store cleared')}
                            >
                              Clear everything
                            </ActionLink>
                          </div>
                        </div>
                        <div className="sys-card-foot">
                          <span className="fs-12 text-muted">{LAST_FULL_CLEAR}</span>
                          <ActionLink
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                            onClick={() => openWorkspace('Cache clearing')}
                          >
                            <i className="ti ti-arrow-right me-1" />
                            Open
                          </ActionLink>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <span className="sys-lbl">Cache stores</span>
                      {CACHE_STORES.map((store) => (
                        <div className="sys-item" key={store.id}>
                          <div className="sys-item-body">
                            <strong>
                              {store.label}
                              <span className="sys-ver">{store.size}</span>
                            </strong>
                            <span>{store.note}</span>
                          </div>
                          <div className="sys-item-side">
                            <span className="sys-tag">{hitRateLabel(store.hitRate)}</span>
                            <span className={`sys-badge ${storeTone(store.state)}`.trim()}>
                              {store.state}
                            </span>
                            <ActionLink
                              className="btn btn-sm btn-outline-light bg-white"
                              onClick={() => push(`${store.label} cache cleared`)}
                            >
                              Clear
                            </ActionLink>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 07 Background jobs */}
                <div className={pane('jobs')} id="syspane-jobs" role="tabpanel">
                  <SectionHead id="jobs" />
                  <div className="row g-4 mb-4">
                    <div className="col-12 col-xl-6">
                      <div className="sys-card">
                        <div className="sys-card-head">
                          <span className="sys-card-ic is-warn">
                            <i className="ti ti-cpu" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="sys-card-title">Queue workers</p>
                            <p>What actually runs the jobs</p>
                          </div>
                          <span className="sys-badge is-warn">
                            {WORKERS_RESPONDING} of {WORKERS_TOTAL}
                          </span>
                        </div>
                        <div className="sys-card-body">
                          <div className="sys-row">
                            <div className="sys-row-key">
                              Workers
                              <small>Three of four are responding</small>
                            </div>
                            <div className="sys-row-val">
                              <b className="sys-mono">
                                {WORKERS_RESPONDING} / {WORKERS_TOTAL}
                              </b>
                            </div>
                          </div>
                          <div className="sys-row">
                            <div className="sys-row-key">
                              Driver
                              <small>Redis</small>
                            </div>
                            <div className="sys-row-val">
                              <span className="sys-tag">Redis</span>
                            </div>
                          </div>
                          <div className="sys-row">
                            <div className="sys-row-key">
                              Queue depth
                              <small>{QUEUE_DEPTH} jobs waiting, draining normally</small>
                            </div>
                            <div className="sys-row-val">
                              <b className="sys-mono">{QUEUE_DEPTH}</b>
                            </div>
                          </div>
                          <div className="sys-row">
                            <div className="sys-row-key">
                              Failed jobs
                              <small>All from the AI batch</small>
                            </div>
                            <div className="sys-row-val">
                              <b className="sys-mono">{FAILED_JOBS}</b>
                            </div>
                          </div>
                          <div className="sys-row">
                            <div className="sys-row-key">
                              Restart workers
                              <small>Rolling, so nothing in flight is lost</small>
                            </div>
                            <div className="sys-row-val">
                              <ActionLink
                                className="btn btn-sm btn-outline-light bg-white"
                                onClick={() => push('Workers restarting, rolling')}
                              >
                                Restart
                              </ActionLink>
                            </div>
                          </div>
                        </div>
                        <div className="sys-card-foot">
                          <span className="fs-12 text-muted">
                            Worker 4 stopped responding at 00:12
                          </span>
                          <ActionLink
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                            onClick={() => openWorkspace('Queue workers')}
                          >
                            <i className="ti ti-arrow-right me-1" />
                            Open
                          </ActionLink>
                        </div>
                      </div>
                    </div>

                    <SystemCard card={JOB_FAILURE_CARD} onOpen={openWorkspace} />
                  </div>

                  <span className="sys-lbl">Scheduled jobs</span>
                  {JOBS.map((job) => (
                    <div className="sys-item" key={job.id}>
                      <div className="sys-item-body">
                        <strong>
                          {job.name}
                          <span className="sys-tag">
                            <i className="ti ti-clock" />
                            {job.when}
                          </span>
                        </strong>
                        <span>{job.lastRun}</span>
                      </div>
                      <div className="sys-item-side">
                        <span className={`sys-badge ${jobTone(job.status)}`}>{job.status}</span>
                        <ActionLink
                          className="btn btn-sm btn-outline-light bg-white"
                          ariaLabel={`Open system configuration workspace for ${job.name}`}
                          onClick={() => openWorkspace(job.name)}
                        >
                          Open
                        </ActionLink>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 08 Maintenance */}
                <div className={pane('maintenance')} id="syspane-maintenance" role="tabpanel">
                  <SectionHead id="maintenance" />
                  <div className="sys-switchboard mb-4">
                    <span className="sys-switchboard-ic">
                      <i className="ti ti-tool" />
                    </span>
                    <div className="sys-switchboard-body">
                      <h3 className="fs-15 fw-medium mb-1">
                        Maintenance mode is off — the platform is open
                      </h3>
                      <p className="fs-12 text-muted mb-0">{MAINTENANCE_OFF_NOTE}</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger d-inline-flex align-items-center"
                      onClick={() => setDialog('maintenance')}
                    >
                      <i className="ti ti-power me-1" />
                      Enable maintenance mode
                    </button>
                  </div>

                  <div className="row g-4">
                    {MAINTENANCE_CARDS.map((card) => (
                      <SystemCard key={card.id} card={card} onOpen={openWorkspace} />
                    ))}

                    <div className="col-12 col-xl-6">
                      <div className="sys-card">
                        <div className="sys-card-head">
                          <span className="sys-card-ic is-warn">
                            <i className="ti ti-refresh-dot" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="sys-card-title">Manual actions</p>
                            <p>Things a Super Administrator can trigger now</p>
                          </div>
                          <span className="sys-badge is-warn">Use carefully</span>
                        </div>
                        <div className="sys-card-body">
                          {MANUAL_ACTIONS.map((action) => (
                            <div className="sys-row" key={action.id}>
                              <div className="sys-row-key">
                                {action.title}
                                <small>{action.detail}</small>
                              </div>
                              <div className="sys-row-val">
                                <ActionLink
                                  className="btn btn-sm btn-outline-light bg-white"
                                  onClick={() =>
                                    action.id === 'restore'
                                      ? setDialog('restore')
                                      : push(`${action.title} started`)
                                  }
                                >
                                  {action.label}
                                </ActionLink>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="sys-card-foot">
                          <span className="fs-12 text-muted">
                            {MANUAL_ACTIONS.length} actions
                          </span>
                          <ActionLink
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                            onClick={() => openWorkspace('Manual actions')}
                          >
                            <i className="ti ti-arrow-right me-1" />
                            Open
                          </ActionLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 09 Security */}
                <div className={pane('security')} id="syspane-security" role="tabpanel">
                  <SectionHead id="security" />
                  <div className="row g-4">
                    {SECURITY_CARDS.map((card) => (
                      <SystemCard key={card.id} card={card} onOpen={openWorkspace} />
                    ))}

                    <div className="col-12 col-xl-6">
                      <div className="sys-card">
                        <div className="sys-card-head">
                          <span className="sys-card-ic">
                            <i className="ti ti-scan" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="sys-card-title">Scanning</p>
                            <p>What checks itself, and when</p>
                          </div>
                          <span className="sys-badge is-up">Clean</span>
                        </div>
                        <div className="sys-card-body">
                          {SCANS.map((scan) => (
                            <div className={`sys-check ${scan.tone}`.trim()} key={scan.id}>
                              <i
                                className={scan.tone ? 'ti ti-alert-circle' : 'ti ti-circle-check'}
                              />
                              <div>
                                {scan.title}
                                <span>{scan.detail}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="sys-card-foot">
                          <span className="fs-12 text-muted">{LAST_SCAN}</span>
                          <ActionLink
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                            onClick={() => openWorkspace('Scanning')}
                          >
                            <i className="ti ti-arrow-right me-1" />
                            Open
                          </ActionLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 10 Logging */}
                <div className={pane('logging')} id="syspane-logging" role="tabpanel">
                  <SectionHead id="logging" />
                  <div className="row g-4">
                    {LOGGING_CARDS.map((card) => (
                      <SystemCard key={card.id} card={card} onOpen={openWorkspace} />
                    ))}

                    <div className="col-12">
                      <div className="sys-card">
                        <div className="sys-card-head">
                          <span className="sys-card-ic">
                            <i className="ti ti-file-text" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="sys-card-title">Recent platform log</p>
                            <p>
                              Last {LOG.length} of {LOG_TOTAL.toLocaleString('en-US')} entries ·
                              retained {LOG_RETENTION_DAYS} days
                            </p>
                          </div>
                          {LOG_CHIPS.map((chip) => (
                            <span className={`sys-badge ${chip.tone}`} key={chip.id}>
                              {chip.label}
                            </span>
                          ))}
                        </div>
                        <div className="sys-card-body">
                          {LOG.map((entry) => (
                            <div className="sys-log" key={entry.id}>
                              <span className="sys-log-t">{entry.at}</span>
                              <span>
                                <span className={`sys-badge ${logTone(entry.level)}`}>
                                  {entry.level}
                                </span>
                              </span>
                              <span className="sys-log-msg">{entry.message}</span>
                            </div>
                          ))}
                        </div>
                        <div className="sys-card-foot">
                          <span className="fs-12 text-muted">{LOG_FOOT}</span>
                          <ActionLink
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                            onClick={() => push('Platform log exported')}
                          >
                            <i className="ti ti-download me-1" />
                            Export log
                          </ActionLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 11 API services */}
                <div className={pane('api')} id="syspane-api" role="tabpanel">
                  <SectionHead id="api" />
                  <div className="row g-4 mb-4">
                    <SystemCard card={API_CARD} onOpen={openWorkspace} />
                    <SystemCard card={API_KEYS_CARD} onOpen={openWorkspace}>
                      <>
                        {API_KEYS.map((key) => (
                          <div className="sys-row" key={key.id}>
                            <div className="sys-row-key">
                              {key.label}
                              <small>
                                {key.scope} · {key.ageDays} days old
                              </small>
                            </div>
                            <div className="sys-row-val">
                              <ActionLink
                                className={`btn btn-sm ${
                                  keyOverdue(key) ? 'btn-danger' : 'btn-outline-light bg-white'
                                }`}
                                onClick={() => push(`${key.label} key rotated`)}
                              >
                                {keyOverdue(key) ? 'Rotate' : 'Current'}
                              </ActionLink>
                            </div>
                          </div>
                        ))}
                        {API_KEYS_CARD.rows.map((row) => (
                          <div className="sys-row" key={row.id}>
                            <div className="sys-row-key">
                              {row.label}
                              {row.note ? <small>{row.note}</small> : null}
                            </div>
                            <div className="sys-row-val">
                              {row.control.kind === 'reading' ? (
                                <b className="sys-mono">{row.control.value}</b>
                              ) : row.control.kind === 'select' ? (
                                <span className="sys-tag">{row.control.value}</span>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </>
                    </SystemCard>
                  </div>

                  <span className="sys-lbl">Endpoints</span>
                  {ENDPOINTS.map((endpoint) => (
                    <div className="sys-item" key={endpoint.id}>
                      <div className="sys-item-body">
                        <strong>
                          <span className="sys-ver">{endpoint.method}</span>
                          <code>{endpoint.path}</code>
                        </strong>
                        <span>{endpoint.note}</span>
                      </div>
                      <div className="sys-item-side">
                        <span className="sys-tag">
                          <i className="ti ti-plug" />
                          {endpoint.consumers}
                        </span>
                        <span className={`sys-badge ${endpoint.live ? 'is-up' : ''}`.trim()}>
                          {endpoint.live ? 'Live' : 'Disabled'}
                        </span>
                        <ActionLink
                          className="btn btn-sm btn-outline-light bg-white"
                          ariaLabel={`Open system configuration workspace for ${endpoint.path}`}
                          onClick={() => openWorkspace(endpoint.path)}
                        >
                          Open
                        </ActionLink>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 12 Integrations */}
                <div className={pane('integrations')} id="syspane-integrations" role="tabpanel">
                  <SectionHead id="integrations" />
                  <div className="row g-4">
                    <SystemCard card={INTEGRATIONS_CARD} onOpen={openWorkspace} />
                    <SystemCard card={WEBHOOKS_CARD} onOpen={openWorkspace} />
                  </div>
                </div>

                {/* 13 Environment */}
                <div className={pane('environment')} id="syspane-environment" role="tabpanel">
                  <SectionHead id="environment" />
                  <div className="row g-4">
                    <div className="col-12 col-xl-6">
                      <div className="sys-card">
                        <div className="sys-card-head">
                          <span className="sys-card-ic">
                            <i className="ti ti-cloud" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="sys-card-title">Runtime</p>
                            <p>What the platform is actually running on</p>
                          </div>
                          <span className="sys-badge is-up">Supported</span>
                        </div>
                        <div className="sys-card-body">
                          <div className="sys-code mt-2 mb-2">
                            {RUNTIME_COMMAND}
                            <br />
                            <br />
                            {RUNTIME.map((line) => (
                              <Fragment key={line[0]}>
                                {runtimeLine(line)}
                                <br />
                              </Fragment>
                            ))}
                          </div>
                          <p className="fs-12 text-muted mb-0">
                            Every line here comes from the environment file, which sits outside the
                            web root and is never included in an export or a backup of settings.
                          </p>
                        </div>
                        <div className="sys-card-foot">
                          <span className="fs-12 text-muted">Read at 02:14 today</span>
                          <ActionLink
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                            onClick={() => setDialog('environment')}
                          >
                            <i className="ti ti-edit me-1" />
                            Update environment
                          </ActionLink>
                        </div>
                      </div>
                    </div>

                    <SystemCard card={ENVIRONMENTS_CARD} onOpen={openWorkspace} />
                    <SystemCard card={INFRASTRUCTURE_CARD} onOpen={openWorkspace} />
                  </div>
                </div>

                {/* 14 System health */}
                <div className={pane('health')} id="syspane-health" role="tabpanel">
                  <SectionHead id="health" />
                  <div className="row g-4">
                    <div className="col-12 col-xl-7">
                      <div className="sys-card">
                        <div className="sys-card-head">
                          <span className="sys-card-ic">
                            <i className="ti ti-activity-heartbeat" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="sys-card-title">Health checks</p>
                            <p>
                              Run every {HEALTH_INTERVAL} seconds · {HEALTH_PASSING} of{' '}
                              {HEALTH.length} passing
                            </p>
                          </div>
                          <span className="sys-badge is-warn">{HEALTH_FAILING} failing</span>
                        </div>
                        <div className="sys-card-body">
                          {HEALTH.map((check) => (
                            <div
                              className={`sys-check ${check.passing ? '' : 'is-down'}`.trim()}
                              key={check.id}
                            >
                              <i
                                className={
                                  check.passing ? 'ti ti-circle-check' : 'ti ti-circle-x'
                                }
                              />
                              <div>
                                {check.title}
                                <span>{check.detail}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="sys-card-foot">
                          <span className="fs-12 text-muted">Last run 47 seconds ago</span>
                          <ActionLink
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                            onClick={() => openWorkspace('Health checks')}
                          >
                            <i className="ti ti-arrow-right me-1" />
                            Open
                          </ActionLink>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-xl-5">
                      <div className="sys-card">
                        <div className="sys-card-head">
                          <span className="sys-card-ic">
                            <i className="ti ti-heartbeat" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="sys-card-title">Availability</p>
                            <p>What the last thirty days looked like</p>
                          </div>
                          <span className="sys-badge is-up">{AVAILABILITY}</span>
                        </div>
                        <div className="sys-card-body">
                          <div className="sys-uptime">
                            {Array.from({ length: UPTIME_DAYS }, (_, day) => (
                              <i className={day === 21 ? 'is-down' : ''} key={day} />
                            ))}
                          </div>
                          <div className="sys-uptime-meta">
                            <span>01 Jul</span>
                            <span>30 Jul</span>
                          </div>
                          <p className="fs-12 text-muted mb-0 mt-3">{AVAILABILITY_NOTE}</p>
                        </div>
                        <div className="sys-card-foot">
                          <span className="fs-12 text-muted">1 incident in 30 days</span>
                          <ActionLink
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                            onClick={() => openWorkspace('Availability')}
                          >
                            <i className="ti ti-arrow-right me-1" />
                            Open
                          </ActionLink>
                        </div>
                      </div>
                    </div>

                    <SystemCard card={ALERTING_CARD} onOpen={openWorkspace} />
                  </div>
                </div>

                {/* 15 Backups */}
                <div className={pane('backups')} id="syspane-backups" role="tabpanel">
                  <SectionHead id="backups" />
                  <div className="row g-4 mb-4">
                    {BACKUP_CARDS.map((card) => (
                      <SystemCard key={card.id} card={card} onOpen={openWorkspace} />
                    ))}
                  </div>

                  <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                    <span className="sys-lbl mb-0">Recent backups</span>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm d-inline-flex align-items-center"
                      onClick={() => setDialog('backup')}
                    >
                      <i className="ti ti-archive me-1" />
                      Back up now
                    </button>
                  </div>
                  {BACKUPS.map((backup) => (
                    <div className="sys-item" key={backup.id}>
                      <div className="sys-item-body">
                        <strong>
                          {backup.at}
                          <span className="sys-tag">{backup.kind}</span>
                        </strong>
                        <span>{backup.detail}</span>
                      </div>
                      <div className="sys-item-side">
                        <span className={`sys-badge ${backupTone(backup.state)}`}>
                          {backup.state}
                        </span>
                        <ActionLink
                          className="btn btn-sm btn-outline-light bg-white"
                          onClick={() => setDialog('restore')}
                        >
                          Restore
                        </ActionLink>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 16 Updates */}
                <div className={pane('updates')} id="syspane-updates" role="tabpanel">
                  <SectionHead id="updates" />
                  <div className="sys-switchboard mb-4">
                    <span className="sys-switchboard-ic">
                      <i className="ti ti-download" />
                    </span>
                    <div className="sys-switchboard-body">
                      <h3 className="fs-15 fw-medium mb-1">
                        Version {AVAILABLE_VERSION} is available
                      </h3>
                      <p className="fs-12 text-muted mb-2">
                        Released {RELEASED_ON} · currently running {INSTALLATION.version}
                        <span className="sys-badge is-accent ms-2">Minor release</span>
                      </p>
                      <p className="fs-12 text-muted mb-2">
                        A minor release, so no database migration is destructive and the upgrade is
                        reversible for seven days. It has been running on staging since 24 July
                        without incident.
                      </p>
                      {UPGRADE_NOTES.map((note) => (
                        <div className="sys-check" key={note.id}>
                          <i className="ti ti-circle-check" />
                          <div>
                            {note.title}
                            <span>{note.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex flex-column align-items-end gap-2">
                      <span className="fs-12 text-muted">Planned for {UPGRADE_WINDOW}</span>
                      <button
                        type="button"
                        className="btn btn-primary d-inline-flex align-items-center"
                        onClick={() => push(`${AVAILABLE_VERSION} scheduled for ${UPGRADE_WINDOW}`)}
                      >
                        <i className="ti ti-calendar-plus me-1" />
                        Schedule upgrade
                      </button>
                    </div>
                  </div>

                  <div className="row g-4">
                    <SystemCard card={UPDATE_POLICY_CARD} onOpen={openWorkspace} />
                    <SystemCard card={VERSION_CARD} onOpen={openWorkspace} />
                  </div>
                </div>

                {/* 17 Licensing */}
                <div className={pane('licensing')} id="syspane-licensing" role="tabpanel">
                  <SectionHead id="licensing" />
                  <div className="row g-4">
                    {LICENCE_CARDS.map((card) => (
                      <SystemCard key={card.id} card={card} onOpen={openWorkspace} />
                    ))}
                  </div>
                </div>

                {/* 18 Advanced */}
                <div className={pane('advanced')} id="syspane-advanced" role="tabpanel">
                  <SectionHead id="advanced" />
                  <div className="row g-4">
                    <div className="col-12 col-xl-6">
                      <div className="sys-card">
                        <div className="sys-card-head">
                          <span className="sys-card-ic">
                            <i className="ti ti-terminal-2" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="sys-card-title">Environment variables</p>
                            <p>Read from the file on the host</p>
                          </div>
                          <span className="sys-badge">Read-only</span>
                        </div>
                        <div className="sys-card-body">
                          <div className="sys-code mt-2 mb-2">
                            {ENV_VARS.map((line) => (
                              <Fragment key={line}>
                                {line}
                                <br />
                              </Fragment>
                            ))}
                          </div>
                          <p className="fs-12 text-muted mb-0">
                            Shown here for reference only. Secrets are masked and the file itself is
                            edited on the host, never through the browser — a settings page that can
                            rewrite its own credentials is a settings page that can lock you out.
                          </p>
                        </div>
                        <div className="sys-card-foot">
                          <span className="fs-12 text-muted">{ENV_VARS.length} variables</span>
                          <ActionLink
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                            onClick={() => setDialog('environment')}
                          >
                            <i className="ti ti-arrow-right me-1" />
                            Open
                          </ActionLink>
                        </div>
                      </div>
                    </div>

                    <SystemCard card={EXPERIMENTAL_CARD} onOpen={openWorkspace} />

                    <div className="col-12 col-xl-6">
                      <div className="sys-card">
                        <div className="sys-card-head">
                          <span className="sys-card-ic">
                            <i className="ti ti-command" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="sys-card-title">Console commands</p>
                            <p>Run from here rather than over SSH</p>
                          </div>
                          <span className="sys-badge is-accent">
                            {CONSOLE_COMMANDS.length} available
                          </span>
                        </div>
                        <div className="sys-card-body">
                          <p className="fs-12 text-muted">
                            Commands a Super Administrator may run from here rather than over SSH.
                            Each is recorded in the audit history with the account that ran it.
                          </p>
                          {CONSOLE_COMMANDS.map((command) => (
                            <div className="sys-row" key={command}>
                              <div className="sys-row-key">
                                <span className="sys-mono">{command}</span>
                              </div>
                              <div className="sys-row-val">
                                <ActionLink
                                  className="btn btn-sm btn-outline-light bg-white"
                                  onClick={() => push(`${command} queued`)}
                                >
                                  Run
                                </ActionLink>
                              </div>
                            </div>
                          ))}
                          <p className="fs-12 text-muted mb-0 mt-2">
                            Anything destructive — migrations, seeding, key rotation — is
                            deliberately not available here.
                          </p>
                        </div>
                        <div className="sys-card-foot">
                          <span className="fs-12 text-muted">Recorded in the audit history</span>
                          <ActionLink
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                            onClick={() => openWorkspace('Console commands')}
                          >
                            <i className="ti ti-arrow-right me-1" />
                            Open
                          </ActionLink>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-xl-6">
                      <div className="sys-card">
                        <div className="sys-card-head">
                          <span className="sys-card-ic is-warn">
                            <i className="ti ti-rotate-2" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="sys-card-title">Reset configuration</p>
                            <p>Returns every setting to the shipped default</p>
                          </div>
                          <span className="sys-badge is-down">Destructive</span>
                        </div>
                        <div className="sys-card-body">
                          <p className="fs-12 text-muted mb-0">
                            Resetting returns every setting on this page to the shipped default.
                            Data, schools, users and backups are untouched, but the platform will
                            need reconfiguring before it behaves as it does now.
                          </p>
                        </div>
                        <div className="sys-card-foot">
                          <span className="fs-12 text-muted">
                            {USERS.toLocaleString('en-US')} users depend on this configuration
                          </span>
                          <ActionLink
                            className="btn btn-sm btn-danger d-inline-flex align-items-center"
                            onClick={() => setDialog('restore')}
                          >
                            <i className="ti ti-rotate-2 me-1" />
                            Restore configuration
                          </ActionLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 19 Audit history */}
                <div className={pane('audit')} id="syspane-audit" role="tabpanel">
                  <SectionHead id="audit" />
                  <div className="sys-card mb-4">
                    <div className="sys-card-head">
                      <span className="sys-card-ic">
                        <i className="ti ti-file-search" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sys-card-title">Audit history</p>
                        <p>
                          Every platform change and every automatic event, retained 3 years
                        </p>
                      </div>
                      <span className="sys-badge">
                        {AUDIT.length} of {AUDIT_TOTAL.toLocaleString('en-US')} entries
                      </span>
                    </div>
                    <div className="sys-card-body">
                      {AUDIT.map((entry) => (
                        <div className="sys-audit" key={entry.id}>
                          <div className="sys-audit-when">
                            <strong>{entry.date}</strong>
                            {entry.time}
                          </div>
                          <div className="sys-audit-what">
                            {entry.what}
                            <span>{entry.who}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="sys-card-foot">
                      <span className="fs-12 text-muted">
                        Entries cannot be edited or removed, including by a Super Administrator
                      </span>
                      <ActionLink
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        onClick={() => setDialog('export')}
                      >
                        <i className="ti ti-download me-1" />
                        Export history
                      </ActionLink>
                    </div>
                  </div>

                  <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                    <div>
                      <h3 className="fs-16 fw-medium mb-1">System activity</h3>
                      <p className="fs-13 text-muted mb-0">
                        How this installation reached its present state.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                      onClick={() => setDialog('export')}
                    >
                      <i className="ti ti-download me-1" />
                      Export activity
                    </button>
                  </div>
                  <div className="sys-stair mb-4">
                    {TIMELINE.map((step, index) => (
                      <div className={`sys-stair-step is-done sys-i-${index}`} key={step.id}>
                        <div className="sys-stair-card">
                          <span className="sys-stair-ic">
                            <i className={step.icon} />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <h4 className="fs-15 fw-medium">{step.title}</h4>
                            <time>{step.at}</time>
                            <p>{step.detail}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                    <div>
                      <h3 className="fs-16 fw-medium mb-1">Recommendations</h3>
                      <p className="fs-13 text-muted mb-0">
                        What the platform suggests looking at, in the order it would look.
                      </p>
                    </div>
                  </div>
                  <div className="row g-4">
                    {RECOMMENDATIONS.map((advice) => (
                      <div className="col-xl-4 col-md-6" key={advice.id}>
                        <div className={`sys-advice ${adviceTone(advice.severity)}`}>
                          <div className="sys-advice-top">
                            <span className="sys-advice-sev">
                              <i className="ti ti-alert-triangle" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <span className="sys-lbl mb-0">{advice.area}</span>
                              <p className="sys-advice-title">{advice.title}</p>
                            </div>
                          </div>
                          <p className="sys-advice-txt">{advice.detail}</p>
                          <div className="sys-advice-foot">
                            <span className={`sys-badge ${adviceTone(advice.severity)}`}>
                              {advice.severity}
                            </span>
                            <ActionLink
                              className="btn btn-sm btn-outline-light bg-white"
                              onClick={() => setSection(advice.goTo)}
                            >
                              {advice.action}
                            </ActionLink>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SystemSettingsModals open={dialog} onClose={() => setDialog(null)} onToast={push} />

      {workspace === null ? null : (
        <SystemWorkspace
          open
          onClose={() => setWorkspace(null)}
          subject={workspace}
          onToast={push}
        />
      )}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="systemSettingsToasts" />
    </>
  );
};

export default SystemSettings;
