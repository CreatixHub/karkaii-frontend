import { useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { useToasts } from '@hooks/useToasts';
import AiWorkspace from './components/AiWorkspace';
import SettingsCard from './components/SettingsCard';
import { ModelDials, Ruler } from './components/ModelGauges';
import AiSettingsModals, { type AiDialog } from './modals/AiSettingsModals';
import type { Model, SectionId } from './data/aiSettings.data';
import {
  ACTIVE_GUARDRAILS,
  AUDIT,
  AUDIT_TOTAL,
  AUTOMATIONS,
  automationRowTone,
  automationTone,
  COST_PROJECTED,
  COST_SO_FAR,
  CONNECTED_COUNT,
  DEFAULT_MODEL,
  DEFAULT_PROVIDER,
  DRAFT_COUNT,
  ENABLED_FEATURES,
  FEATURES,
  featureNameOf,
  featuresOnProvider,
  GUARDRAIL_REVIEW,
  GUARDRAILS,
  grantIcon,
  grantTone,
  LAST_CHANGE,
  LOG,
  LOG_CHIPS,
  LOG_NOTE,
  logRowTone,
  millions,
  MODELS,
  modelTone,
  NEEDS_ATTENTION,
  PERMISSION_COLUMNS,
  PERMISSION_FOOT,
  PERMISSION_LEGEND,
  promptParts,
  PROMPT_FOOTNOTE,
  PROMPTS,
  PROVIDERS,
  providerTone,
  REQUESTS,
  RETENTION_DAYS,
  ROLES,
  RUNNING_AUTOMATIONS,
  SECTIONS,
  sectionNumber,
  tokens,
  TOKEN_CEILING,
  TOKENS_USED,
  USED_PERCENT,
} from './data/aiSettings.data';
import {
  ADMIN_ON,
  AUTOMATION_CARDS,
  CEILINGS_CARD,
  GENERAL_CARDS,
  MODERATION_CARDS,
  NOTIFICATION_CARDS,
  PRIVACY_CARDS,
  REPORTED,
  SCOPE_CARD,
  SCOPE_FOOT,
  SPEND_CARD,
} from './data/cards.data';

/** The heading every section opens with — its number, name and lead line. */
const SectionHead = ({ id }: { id: SectionId }) => {
  const section = SECTIONS.find((entry) => entry.id === id);
  if (!section) return null;

  return (
    <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
      <div>
        <span className="aig-lbl">Section {sectionNumber(id)}</span>
        <h2 className="aig-hero-title fs-20 mb-1">{section.label}</h2>
        <p className="fs-13 text-muted mb-0">{section.lead}</p>
      </div>
    </div>
  );
};

/** The switch every card, provider, model, feature and automation carries. */
const Switch = ({ id, on }: { id: string; on: boolean }) => {
  const [checked, setChecked] = useState(on);

  return (
    <div className="form-check form-switch mb-0">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={id}
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
      <label className="form-check-label visually-hidden" htmlFor={id}>
        Enable
      </label>
    </div>
  );
};

const AiSettings = () => {
  const { toasts, push, dismiss } = useToasts();

  const [section, setSection] = useState<SectionId>('general');
  const [dialog, setDialog] = useState<AiDialog>(null);
  const [workspace, setWorkspace] = useState<{ model: Model; subject?: string } | null>(null);

  /** Open the workspace for a model, naming what the reader clicked to get there. */
  const openWorkspace = (subject?: string, modelId?: string) => {
    const model = MODELS.find((entry) => entry.id === modelId) ?? DEFAULT_MODEL;
    setWorkspace({ model, subject: subject === model.id ? undefined : subject });
  };

  const pane = (id: SectionId) =>
    `tab-pane fade${section === id ? ' show active' : ''}`;

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* AI Configuration Hero */}
          <div className="aig-hero">
            <div className="aig-hero-top">
              <span className="aig-hero-crest">
                <i className="ti ti-brain" />
              </span>
              <div className="flex-fill">
                <h1 className="aig-hero-title">AI Settings</h1>
                <p className="aig-hero-sub">
                  Which provider answers, which model each feature is routed to, what it may see,
                  and what it is allowed to do on its own. Nothing on the AI pages runs outside what
                  is set here.
                </p>
              </div>
              <span className="aig-badge is-warn">
                <i className="ti ti-alert-circle" />
                {NEEDS_ATTENTION} items need attention
              </span>
            </div>
            <div className="aig-hero-facts">
              <div className="aig-hero-fact">
                <span>Active provider</span>
                <strong>
                  {DEFAULT_PROVIDER.name} <span className="aig-badge is-accent">Default</span>
                </strong>
              </div>
              <div className="aig-hero-fact">
                <span>Default model</span>
                <strong>
                  <span className="aig-chip">
                    <i className="ti ti-box-model" />
                    {DEFAULT_MODEL.id}
                  </span>
                </strong>
              </div>
              <div className="aig-hero-fact">
                <span>Configuration</span>
                <strong>
                  Published <span className="aig-badge">{DRAFT_COUNT} drafts</span>
                </strong>
              </div>
              <div className="aig-hero-fact">
                <span>Automation</span>
                <strong>
                  {RUNNING_AUTOMATIONS} of {AUTOMATIONS.length} running
                </strong>
              </div>
              <div className="aig-hero-fact">
                <span>Last update</span>
                <strong>
                  {LAST_CHANGE.on} · {LAST_CHANGE.by}
                </strong>
              </div>
            </div>
            <div className="aig-hero-actions">
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => setDialog('publish')}
              >
                <i className="ti ti-device-floppy me-1" />
                Save configuration
              </button>
              <button
                type="button"
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => setDialog('test')}
              >
                <i className="ti ti-plug-connected me-1" />
                Test AI configuration
              </button>
              <button
                type="button"
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => setDialog('export')}
              >
                <i className="ti ti-download me-1" />
                Export AI settings
              </button>
              <button
                type="button"
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => setDialog('reset')}
              >
                <i className="ti ti-rotate-2 me-1" />
                Restore defaults
              </button>
            </div>
          </div>
          {/* /AI Configuration Hero */}

          <div className="row g-4">
            {/* Sticky settings navigation */}
            <div className="col-12 col-xxl-3 col-lg-4">
              <div className="aig-nav nav flex-column" role="tablist" aria-label="AI settings sections">
                {SECTIONS.map((entry) => (
                  <button
                    key={entry.id}
                    className={`aig-nav-link${section === entry.id ? ' active' : ''}`}
                    id={`aigtab-${entry.id}`}
                    type="button"
                    role="tab"
                    aria-controls={`aigpane-${entry.id}`}
                    aria-selected={section === entry.id}
                    onClick={() => setSection(entry.id)}
                  >
                    <i className={entry.icon} />
                    <span className="aig-nav-txt">{entry.label}</span>
                    {entry.count === undefined ? null : (
                      <span className="aig-nav-n">{entry.count}</span>
                    )}
                  </button>
                ))}

                <div className="aig-nav-foot">
                  <span className="aig-lbl">This month</span>
                  <div className="aig-budget">
                    <span className={`aig-column aig-p-${USED_PERCENT} aig-q-100`}>
                      <span />
                    </span>
                    <div className="aig-budget-facts">
                      <div>
                        <span>Used</span>
                        <b>{millions(TOKENS_USED)}</b>
                      </div>
                      <div>
                        <span>Ceiling</span>
                        <b>{millions(TOKEN_CEILING)}</b>
                      </div>
                      <div>
                        <span>Cost</span>
                        <b>{COST_SO_FAR}</b>
                      </div>
                    </div>
                  </div>
                  <p className="fs-12 text-muted mb-2 mt-3">
                    Tokens across every feature and provider. The red line is the hard ceiling, at
                    which AI features stop rather than overspend.
                  </p>
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm w-100 d-inline-flex align-items-center justify-content-center"
                    onClick={() => setSection('limits')}
                  >
                    <i className="ti ti-gauge me-1" />
                    Usage limits
                  </ActionLink>
                </div>
              </div>
            </div>
            {/* /Sticky settings navigation */}

            <div className="col-12 col-xxl-9 col-lg-8">
              <div className="tab-content">
                {/* 01 General */}
                <div className={pane('general')} id="aigpane-general" role="tabpanel">
                  <SectionHead id="general" />
                  <div className="row g-4">
                    {GENERAL_CARDS.map((card) => (
                      <SettingsCard key={card.id} card={card} onOpen={openWorkspace} />
                    ))}
                  </div>
                </div>

                {/* 02 Providers */}
                <div className={pane('providers')} id="aigpane-providers" role="tabpanel">
                  <SectionHead id="providers" />
                  <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                    <p className="fs-13 text-muted mb-0">
                      {PROVIDERS.length} providers, {CONNECTED_COUNT} connected. Only the default
                      carries traffic; the rest stay configured so a change of route is a switch
                      rather than a rebuild. DeepSeek is deliberately unconnected — there is no data
                      processing agreement covering student records.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm d-inline-flex align-items-center"
                      onClick={() => setDialog('provider')}
                    >
                      <i className="ti ti-plus me-1" />
                      Add provider
                    </button>
                  </div>
                  <div className="row g-4">
                    {PROVIDERS.map((provider) => {
                      const carried = featuresOnProvider(provider.name);
                      const isDefault = provider.id === DEFAULT_PROVIDER.id;

                      return (
                        <div className="col-xxl-4 col-md-6" key={provider.id}>
                          <div
                            className={`aig-prov${isDefault ? ' is-default' : ''}${
                              provider.enabled ? '' : ' is-off'
                            }`}
                          >
                            <div className="aig-prov-bar">
                              <i className="ti ti-link" />
                              {provider.endpoint}
                            </div>
                            <div className="aig-prov-body">
                              <div className="aig-prov-top">
                                <span className="aig-prov-mark">
                                  <i className={provider.icon} />
                                </span>
                                <div className="flex-fill overflow-hidden">
                                  <p className="aig-prov-name">{provider.name}</p>
                                  <p>
                                    {isDefault
                                      ? `Default provider · used by ${carried.length} of ${FEATURES.length} features`
                                      : provider.note}
                                  </p>
                                </div>
                                <span className={`aig-badge ${providerTone(provider.state)}`}>
                                  {provider.state}
                                </span>
                              </div>
                              <div className="aig-row">
                                <div className="aig-row-key">Authentication</div>
                                <div className="aig-row-val">
                                  <span className="aig-secret">
                                    <i className="ti ti-key" />
                                    {provider.auth}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <span className="aig-lbl">Models available</span>
                                <div className="aig-prov-models">
                                  {provider.models.length === 0 ? (
                                    <span className="fs-12 text-muted">None</span>
                                  ) : (
                                    provider.models.map((id) => (
                                      <span className="aig-chip" key={id}>
                                        {id}
                                      </span>
                                    ))
                                  )}
                                </div>
                              </div>
                              <div className="aig-prov-foot">
                                <Switch id={`prov-${provider.id}`} on={provider.enabled} />
                                <div className="d-flex align-items-center gap-2">
                                  <ActionLink
                                    className="btn btn-sm btn-outline-light bg-white"
                                    ariaLabel={`Open AI configuration workspace for ${provider.name}`}
                                    onClick={() => openWorkspace(provider.name, provider.models[0])}
                                  >
                                    Configure
                                  </ActionLink>
                                  <ActionLink
                                    className={`btn btn-sm btn-outline-light bg-white${
                                      isDefault ? ' disabled' : ''
                                    }`}
                                    onClick={() =>
                                      isDefault
                                        ? undefined
                                        : setDialog('provider')
                                    }
                                  >
                                    Set default
                                  </ActionLink>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 03 Models */}
                <div className={pane('models')} id="aigpane-models" role="tabpanel">
                  <SectionHead id="models" />
                  <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                    <p className="fs-13 text-muted mb-0">
                      {MODELS.length} models across {new Set(MODELS.map((m) => m.provider)).size}{' '}
                      providers. The ruler shows what a real request actually occupies against the
                      window it is allowed — the hatched part is reserve held back so a long answer
                      is never truncated mid-sentence.
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                      onClick={() => setDialog('model')}
                    >
                      <i className="ti ti-settings me-1" />
                      Configure a model
                    </button>
                  </div>
                  <div className="row g-4">
                    {MODELS.map((model) => (
                      <div className="col-xxl-4 col-md-6" key={model.id}>
                        <div className={`aig-model${model.enabled ? '' : ' is-off'}`}>
                          <div className="aig-model-head">
                            <span className="aig-card-ic is-model">
                              <i className="ti ti-box-model" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <p className="aig-model-id">{model.id}</p>
                              <p>{model.provider}</p>
                            </div>
                            <span className={`aig-badge ${modelTone(model.state)}`}>
                              {model.state}
                            </span>
                          </div>
                          <div className="aig-model-body">
                            <p className="fs-12 text-muted mb-3">{model.purpose}</p>
                            <span className="aig-lbl">Context window</span>
                            <Ruler model={model} />
                            <div className="mt-3">
                              <ModelDials model={model} />
                            </div>
                          </div>
                          <div className="aig-model-foot">
                            <Switch id={`model-${model.id}`} on={model.enabled} />
                            <ActionLink
                              className="btn btn-sm btn-outline-light bg-white"
                              ariaLabel={`Open AI configuration workspace for ${model.id}`}
                              onClick={() => openWorkspace(model.id, model.id)}
                            >
                              Configure
                            </ActionLink>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 04 Features */}
                <div className={pane('features')} id="aigpane-features" role="tabpanel">
                  <SectionHead id="features" />
                  <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                    <p className="fs-13 text-muted mb-0">
                      {FEATURES.length} features, each routed to a named model and visible to a
                      named audience. The student assistant runs on the local model and is currently
                      off, because it is the only feature a student would use unsupervised.
                    </p>
                    <span className="aig-badge is-accent">
                      {ENABLED_FEATURES} of {FEATURES.length} enabled
                    </span>
                  </div>
                  {FEATURES.map((feature) => (
                    <div
                      className={`aig-feat${feature.enabled ? '' : ' is-off'}`}
                      key={feature.id}
                    >
                      <span className="aig-feat-ic">
                        <i className={feature.icon} />
                      </span>
                      <div className="aig-feat-body">
                        <strong>{feature.name}</strong>
                        <p>{feature.note}</p>
                      </div>
                      <div className="aig-feat-route">
                        <i className="ti ti-arrow-narrow-right" />
                        <span className="aig-chip">
                          <i className="ti ti-box-model" />
                          {feature.model}
                        </span>
                        <span className="badge-meta">
                          <i className="ti ti-users" />
                          {feature.audience}
                        </span>
                      </div>
                      <div className="aig-feat-act">
                        <Switch id={`feat-${feature.id}`} on={feature.enabled} />
                        <ActionLink
                          className="btn btn-sm btn-outline-light bg-white"
                          ariaLabel={`Open AI configuration workspace for ${feature.name}`}
                          onClick={() => openWorkspace(feature.name, feature.model)}
                        >
                          Configure
                        </ActionLink>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 05 Prompt templates */}
                <div className={pane('prompts')} id="aigpane-prompts" role="tabpanel">
                  <SectionHead id="prompts" />
                  <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                    <p className="fs-13 text-muted mb-0">
                      {PROMPTS.length} templates, each in two parts: a system instruction that sets
                      the boundary, and the task itself. The system half is where the governance
                      lives — it is what stops a homework template awarding a mark.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm d-inline-flex align-items-center"
                      onClick={() => setDialog('prompt')}
                    >
                      <i className="ti ti-plus me-1" />
                      New template
                    </button>
                  </div>
                  <div className="row g-4">
                    {PROMPTS.map((prompt) => (
                      <div className="col-12 col-xxl-6" key={prompt.id}>
                        <div
                          className={`aig-prompt${prompt.state === 'Draft' ? ' is-draft' : ''}`}
                        >
                          <div className="aig-prompt-head">
                            <span className="aig-card-ic">
                              <i className="ti ti-file-text" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <p className="aig-prompt-name">{prompt.name}</p>
                              <p>Used by {featureNameOf(prompt.feature)}</p>
                            </div>
                            <span className="aig-chip is-plain">v{prompt.version}</span>
                            <span
                              className={`aig-badge ${
                                prompt.state === 'Published' ? 'is-on' : 'is-warn'
                              }`}
                            >
                              {prompt.state}
                            </span>
                          </div>
                          <div className="aig-prompt-text">
                            <span className="aig-prompt-role">System</span>
                            {prompt.system}
                          </div>
                          <div className="aig-prompt-text">
                            <span className="aig-prompt-role">Task</span>
                            {promptParts(prompt.task).map((piece) =>
                              piece.isVariable ? (
                                <var key={piece.id}>{piece.text}</var>
                              ) : (
                                <span key={piece.id}>{piece.text}</span>
                              ),
                            )}
                          </div>
                          <div className="aig-prompt-foot">
                            <span className="fs-12 text-muted">{PROMPT_FOOTNOTE}</span>
                            <div className="d-flex align-items-center gap-1">
                              <ActionLink
                                className="btn btn-sm btn-white border"
                                ariaLabel={`Open AI configuration workspace for ${prompt.name}`}
                                onClick={() => openWorkspace(prompt.name)}
                              >
                                <i className="ti ti-eye" />
                              </ActionLink>
                              <ActionLink
                                className="btn btn-sm btn-white border"
                                ariaLabel={`Edit ${prompt.name}`}
                                onClick={() => setDialog('prompt')}
                              >
                                <i className="ti ti-pencil" />
                              </ActionLink>
                              <ActionLink
                                className="btn btn-sm btn-white border"
                                ariaLabel={`Duplicate ${prompt.name}`}
                                onClick={() => push(`${prompt.name} duplicated as a draft`)}
                              >
                                <i className="ti ti-copy" />
                              </ActionLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 06 Automation */}
                <div className={pane('automation')} id="aigpane-automation" role="tabpanel">
                  <SectionHead id="automation" />
                  <div className="row g-4 mb-4">
                    {AUTOMATION_CARDS.map((card) => (
                      <SettingsCard key={card.id} card={card} onOpen={openWorkspace} />
                    ))}
                  </div>
                  <span className="aig-lbl">Automations</span>
                  <p className="fs-13 text-muted mb-3">
                    {RUNNING_AUTOMATIONS === 6 ? 'Six' : RUNNING_AUTOMATIONS} of{' '}
                    {AUTOMATIONS.length} are running. Every one of them produces something for a
                    person to read; none of them acts on its own, which is the position set on the
                    General tab.
                  </p>
                  {AUTOMATIONS.map((job) => (
                    <div className={`aig-auto ${automationRowTone(job.status)}`.trim()} key={job.id}>
                      <div className="aig-auto-body">
                        <strong>
                          {job.name}
                          <span className="badge-meta">
                            <i className="ti ti-clock" />
                            {job.when}
                          </span>
                          <span className="badge-meta">{job.kind}</span>
                        </strong>
                        <span>
                          {job.note} · last run {job.lastRun}
                        </span>
                      </div>
                      <div className="aig-auto-side">
                        <span className={`aig-badge ${automationTone(job.status)}`.trim()}>
                          {job.status}
                        </span>
                        <Switch id={`auto-${job.id}`} on={job.enabled} />
                        <ActionLink
                          className="btn btn-sm btn-outline-light bg-white"
                          ariaLabel={`Open AI configuration workspace for ${job.name}`}
                          onClick={() => setDialog('automation')}
                        >
                          Configure
                        </ActionLink>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 07 Permissions */}
                <div className={pane('permissions')} id="aigpane-permissions" role="tabpanel">
                  <SectionHead id="permissions" />
                  <div className="row g-4">
                    <div className="col-12 col-xl-8">
                      <div className="aig-card">
                        <div className="aig-card-head">
                          <span className="aig-card-ic">
                            <i className="ti ti-lock-access" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="aig-card-title">Who may do what with AI</p>
                            <p>Read a finding · act on it · change a prompt · change a provider</p>
                          </div>
                          <span className="aig-badge is-accent">{ROLES.length} roles</span>
                        </div>
                        <div className="aig-card-body">
                          <div className="aig-perm is-head">
                            <span>Role</span>
                            {PERMISSION_COLUMNS.map((column) => (
                              <span key={column}>{column}</span>
                            ))}
                          </div>
                          {ROLES.map((role) => (
                            <div className="aig-perm" key={role.id}>
                              <span className="aig-perm-name">
                                {role.name}
                                <small>{role.note}</small>
                              </span>
                              {role.grants.map((grant, index) => (
                                <span
                                  className={`aig-dot ${grantTone(grant)}`.trim()}
                                  key={PERMISSION_COLUMNS[index]}
                                >
                                  <i className={grantIcon(grant)} />
                                </span>
                              ))}
                            </div>
                          ))}
                          <div className="d-flex align-items-center gap-3 flex-wrap mt-3">
                            {PERMISSION_LEGEND.map((entry) => (
                              <span
                                className="d-inline-flex align-items-center gap-1 fs-12 text-muted"
                                key={entry.id}
                              >
                                <span className={`aig-dot ${grantTone(entry.grant)}`.trim()}>
                                  <i className={grantIcon(entry.grant)} />
                                </span>
                                {entry.label}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="aig-card-foot">
                          <span className="fs-12 text-muted">{PERMISSION_FOOT}</span>
                          <ActionLink
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                            ariaLabel="Open AI configuration workspace for AI permissions"
                            onClick={() => openWorkspace('AI permissions')}
                          >
                            <i className="ti ti-arrow-right me-1" />
                            Open
                          </ActionLink>
                        </div>
                      </div>
                    </div>

                    <SettingsCard card={SCOPE_CARD} foot={SCOPE_FOOT} onOpen={openWorkspace} />
                  </div>
                </div>

                {/* 08 Privacy & Security */}
                <div className={pane('privacy')} id="aigpane-privacy" role="tabpanel">
                  <SectionHead id="privacy" />
                  <div className="row g-4">
                    {PRIVACY_CARDS.map((card) => (
                      <SettingsCard key={card.id} card={card} onOpen={openWorkspace} />
                    ))}

                    <div className="col-12 col-xl-6">
                      <div className="aig-card">
                        <div className="aig-card-head">
                          <span className="aig-card-ic is-warn">
                            <i className="ti ti-shield-lock" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="aig-card-title">Guardrails</p>
                            <p>Refusals built into every request</p>
                          </div>
                          <span className="aig-badge is-on">{ACTIVE_GUARDRAILS} active</span>
                        </div>
                        <div className="aig-card-body">
                          {GUARDRAILS.map((rail) => (
                            <div className={`aig-check ${rail.tone}`.trim()} key={rail.id}>
                              <i
                                className={
                                  rail.tone ? 'ti ti-alert-circle' : 'ti ti-circle-check'
                                }
                              />
                              <div>
                                {rail.rule}
                                <span>{rail.detail}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="aig-card-foot">
                          <span className="fs-12 text-muted">{GUARDRAIL_REVIEW}</span>
                          <ActionLink
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                            ariaLabel="Open AI configuration workspace for Guardrails"
                            onClick={() => openWorkspace('Guardrails')}
                          >
                            <i className="ti ti-arrow-right me-1" />
                            Open
                          </ActionLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 09 Usage Limits */}
                <div className={pane('limits')} id="aigpane-limits" role="tabpanel">
                  <SectionHead id="limits" />
                  <div className="row g-4">
                    <div className="col-12 col-xl-5">
                      <div className="aig-card">
                        <div className="aig-card-head">
                          <span className="aig-card-ic">
                            <i className="ti ti-gauge" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="aig-card-title">This month</p>
                            <p>Across every feature and provider</p>
                          </div>
                          <span className="aig-badge is-accent">{USED_PERCENT}%</span>
                        </div>
                        <div className="aig-card-body">
                          <div className="aig-budget mt-3">
                            <span className={`aig-column aig-p-${USED_PERCENT} aig-q-100`}>
                              <span />
                            </span>
                            <div className="aig-budget-facts">
                              <div>
                                <span>Tokens used</span>
                                <b>{millions(TOKENS_USED)}</b>
                              </div>
                              <div>
                                <span>Ceiling</span>
                                <b>{millions(TOKEN_CEILING)}</b>
                              </div>
                              <div>
                                <span>Requests</span>
                                <b>{tokens(REQUESTS)}</b>
                              </div>
                              <div>
                                <span>Cost so far</span>
                                <b>{COST_SO_FAR}</b>
                              </div>
                              <div>
                                <span>Projected</span>
                                <b>{COST_PROJECTED}</b>
                              </div>
                            </div>
                          </div>
                          <p className="fs-12 text-muted mb-0 mt-3">
                            The red line is a hard stop, not a warning. At the ceiling AI features
                            refuse rather than spend, which is deliberate: an unbounded bill is a
                            worse failure than a temporarily unavailable feature.
                          </p>
                        </div>
                        <div className="aig-card-foot">
                          <span className="fs-12 text-muted">Resets on the 1st</span>
                          <ActionLink
                            className="btn btn-sm btn-outline-light bg-white"
                            ariaLabel="Open AI configuration workspace for Usage this month"
                            onClick={() => openWorkspace('Usage this month')}
                          >
                            Open
                          </ActionLink>
                        </div>
                      </div>
                    </div>

                    <SettingsCard card={CEILINGS_CARD} onOpen={openWorkspace} />
                    <SettingsCard card={SPEND_CARD} onOpen={openWorkspace} />
                  </div>
                </div>

                {/* 10 Notifications */}
                <div className={pane('notifications')} id="aigpane-notifications" role="tabpanel">
                  <SectionHead id="notifications" />
                  <div className="row g-4">
                    <SettingsCard
                      card={{
                        ...NOTIFICATION_CARDS[0],
                        badge: { tone: 'is-accent', label: `${ADMIN_ON} on` },
                      }}
                      onOpen={openWorkspace}
                    />
                    <SettingsCard card={NOTIFICATION_CARDS[1]} onOpen={openWorkspace} />
                  </div>
                </div>

                {/* 11 Content Moderation */}
                <div className={pane('moderation')} id="aigpane-moderation" role="tabpanel">
                  <SectionHead id="moderation" />
                  <div className="row g-4">
                    {MODERATION_CARDS.map((card) => (
                      <SettingsCard key={card.id} card={card} onOpen={openWorkspace} />
                    ))}

                    <div className="col-12">
                      <span className="aig-lbl">Reported outputs</span>
                      <div className="aig-empty">
                        <i className="ti ti-flag-off" />
                        <h3 className="fs-15 fw-medium">{REPORTED.title}</h3>
                        <p>{REPORTED.note}</p>
                        <ActionLink
                          className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                          onClick={() => openWorkspace('Reported outputs')}
                        >
                          <i className="ti ti-history me-1" />
                          {REPORTED.action}
                        </ActionLink>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 12 Logs */}
                <div className={pane('logs')} id="aigpane-logs" role="tabpanel">
                  <SectionHead id="logs" />
                  <div className="aig-card">
                    <div className="aig-card-head">
                      <span className="aig-card-ic">
                        <i className="ti ti-list-details" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="aig-card-title">AI activity log</p>
                        <p>
                          Last {LOG.length} of {tokens(REQUESTS)} entries this month · content
                          retained {RETENTION_DAYS} days, the trail for 3 years
                        </p>
                      </div>
                      {LOG_CHIPS.map((chip) => (
                        <span className={`aig-badge ${chip.tone}`} key={chip.id}>
                          {chip.label}
                        </span>
                      ))}
                    </div>
                    <div className="aig-card-body">
                      {LOG.map((entry) => (
                        <div className={`aig-auto ${logRowTone(entry.kind)}`.trim()} key={entry.id}>
                          <div className="aig-auto-body">
                            <strong>
                              <span className="aig-chip is-plain">{entry.kind}</span>
                              {entry.detail}
                            </strong>
                            <span className="aig-mono">{entry.at}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="aig-card-foot">
                      <span className="fs-12 text-muted">{LOG_NOTE}</span>
                      <ActionLink
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        onClick={() => push('Activity log exported')}
                      >
                        <i className="ti ti-download me-1" />
                        Export log
                      </ActionLink>
                    </div>
                  </div>
                </div>

                {/* 13 Audit History */}
                <div className={pane('audit')} id="aigpane-audit" role="tabpanel">
                  <SectionHead id="audit" />
                  <div className="aig-card">
                    <div className="aig-card-head">
                      <span className="aig-card-ic">
                        <i className="ti ti-file-search" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="aig-card-title">Audit history</p>
                        <p>Every change to AI configuration, retained for 3 academic years</p>
                      </div>
                      <span className="aig-badge is-accent">
                        {AUDIT.length} of {AUDIT_TOTAL} entries
                      </span>
                    </div>
                    <div className="aig-card-body">
                      {AUDIT.map((entry) => (
                        <div className="aig-audit" key={entry.id}>
                          <div className="aig-audit-when">
                            <strong>{entry.date}</strong>
                            {entry.time}
                          </div>
                          <div className="aig-audit-what">
                            {entry.what}
                            <span>{entry.who}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="aig-card-foot">
                      <span className="fs-12 text-muted">Entries cannot be edited or removed</span>
                      <ActionLink
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        onClick={() => setDialog('export')}
                      >
                        <i className="ti ti-download me-1" />
                        Export history
                      </ActionLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AiSettingsModals open={dialog} onClose={() => setDialog(null)} onToast={push} />

      {workspace ? (
        <AiWorkspace
          open
          onClose={() => setWorkspace(null)}
          model={workspace.model}
          subject={workspace.subject}
          onToast={push}
        />
      ) : null}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="aiSettingsToasts" />
    </>
  );
};

export default AiSettings;
