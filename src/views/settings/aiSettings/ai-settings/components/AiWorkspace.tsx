import Offcanvas from '@components/ui/Offcanvas';
import type { Model } from '../data/aiSettings.data';
import {
  DEFAULT_MODEL,
  featuresOnModel,
  LAST_CHANGE,
  maxTokensPercent,
  modelTone,
  PROMPTS,
  temperaturePercent,
  historyOf,
  timeoutPercent,
  tokens,
  TOKENS_USED,
  topPPercent,
  AUTOMATIONS,
  FEATURES,
  millions,
} from '../data/aiSettings.data';
import { Dial, Ruler } from './ModelGauges';

export interface AiWorkspaceProps {
  open: boolean;
  onClose: () => void;
  model: Model;
  /** What the reader clicked to get here, shown when it was not the model itself. */
  subject?: string;
  onToast: (message: string) => void;
}

/** The validation lines the panel prints, three of which are checks on the model. */
const validationFor = (model: Model) => {
  const routed = featuresOnModel(model.id);
  const unpublished = routed.filter((feature) => {
    const prompt = PROMPTS.find((entry) => entry.feature === feature.id);
    return !prompt || prompt.state !== 'Published';
  });

  return [
    {
      id: 'reachable',
      tone: '',
      title: 'Provider reachable and authenticated',
      detail: 'Verified at 09:04 today, 2.4 s round trip.',
    },
    {
      id: 'retention',
      tone: '',
      title: 'Zero-retention endpoint confirmed',
      detail: 'Required before a provider may be connected at all.',
    },
    unpublished.length === 0
      ? {
          id: 'prompts',
          tone: '',
          title: 'Every routed feature has a published prompt',
          detail: 'A feature without one cannot run.',
        }
      : {
          id: 'prompts',
          tone: 'is-warn',
          title: `${unpublished.length} routed feature${unpublished.length === 1 ? '' : 's'} without a published prompt`,
          detail: 'A feature without one cannot run.',
        },
    {
      id: 'homework',
      tone: 'is-warn',
      title: 'Homework evaluation is heavier than it needs to be',
      detail: '25% of spend on a task the smaller model handles identically.',
    },
  ];
};

const AiWorkspace = ({ open, onClose, model, subject, onToast }: AiWorkspaceProps) => {
  const routed = featuresOnModel(model.id);
  const isDefault = model.id === DEFAULT_MODEL.id;
  const prompts = PROMPTS.filter((prompt) =>
    routed.some((feature) => feature.id === prompt.feature),
  );
  const automations = AUTOMATIONS.filter((job) => job.enabled);
  const usageShare = model.usage ? Math.round((model.usage.tokens / TOKENS_USED) * 100) : 0;

  return (
    <Offcanvas
      open={open}
      onClose={onClose}
      className="aig-canvas"
      labelledById="aig_workspace_label"
      title={`${model.id}${isDefault ? ' — default model' : ''}`}
      header={
        <div className="aig-canvas-head">
          <span className="aig-card-ic">
            <i className="ti ti-box-model" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h3 className="offcanvas-title mb-1 fs-16 fw-medium" id="aig_workspace_label">
              {model.id}
              {isDefault ? ' — default model' : ''}
            </h3>
            <p className="fs-12 mb-0">
              {model.provider} · routed to {routed.length} of {FEATURES.length} features · last
              changed {LAST_CHANGE.on} by {LAST_CHANGE.by}
              {subject ? ` · opened from ${subject}` : ''}
            </p>
          </div>
          <span className={`aig-badge ${modelTone(model.state)}`}>{model.state}</span>
          <button type="button" className="btn-close ms-2" onClick={onClose} aria-label="Close" />
        </div>
      }
      footer={
        <div className="aig-card-foot justify-content-end">
          <button type="button" className="btn btn-outline-light bg-white" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-light d-inline-flex align-items-center"
            onClick={() => onToast(`${model.id} answered the test prompt`)}
          >
            <i className="ti ti-plug-connected me-1" />
            Test
          </button>
          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center"
            onClick={() => {
              onToast(`${model.id} saved`);
              onClose();
            }}
          >
            <i className="ti ti-device-floppy me-1" />
            Save changes
          </button>
        </div>
      }
    >
      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <div className="aig-sect">
            <h4 className="aig-sect-title fs-15 fw-medium">
              <i className="ti ti-file-description" />
              Configuration details
            </h4>
            <div className="aig-row">
              <div className="aig-row-key">Model</div>
              <div className="aig-row-val">
                <span className="aig-chip">
                  <i className="ti ti-box-model" />
                  {model.id}
                </span>
              </div>
            </div>
            <div className="aig-row">
              <div className="aig-row-key">Provider</div>
              <div className="aig-row-val">{model.provider}</div>
            </div>
            <div className="aig-row">
              <div className="aig-row-key">Purpose</div>
              <div className="aig-row-val">{model.purpose}</div>
            </div>
            <div className="aig-row">
              <div className="aig-row-key">Context window</div>
              <div className="aig-row-val">{tokens(model.window * 1000)} tokens</div>
            </div>
            <div className="aig-row">
              <div className="aig-row-key">Configured</div>
              <div className="aig-row-val">{model.configured}</div>
            </div>
            <div className="aig-row">
              <div className="aig-row-key">Routed to</div>
              <div className="aig-row-val">
                {routed.length} feature{routed.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          <div className="aig-sect">
            <h5 className="aig-sect-title fs-15">
              <i className="ti ti-adjustments" />
              Current settings
            </h5>
            <span className="aig-lbl">Context window</span>
            <Ruler
              model={model}
              className="mb-4"
              tail="The window is far larger than anything the school asks of it."
            />
            <Dial
              label="Temperature"
              value={model.temperature.toFixed(1)}
              percent={temperaturePercent(model.temperature)}
              from="0.0"
              to="2.0"
            />
            <Dial
              label="Maximum output tokens"
              value={tokens(model.maxTokens)}
              percent={maxTokensPercent(model.maxTokens)}
              from="256"
              to="16,384"
            />
            <Dial
              label="Top-p"
              value={model.topP.toFixed(1)}
              percent={topPPercent(model.topP)}
              from="0.0"
              to="1.0"
            />
            <Dial
              label="Request timeout (seconds)"
              value={String(model.timeout)}
              percent={timeoutPercent(model.timeout)}
              from="10"
              to="120"
            />
          </div>

          <div className="aig-sect">
            <h6 className="aig-sect-title">
              <i className="ti ti-sparkles" />
              Supported features
            </h6>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {routed.length === 0 ? (
                <span className="fs-12 text-muted">Not routed to anything yet.</span>
              ) : (
                routed.map((feature) => (
                  <span className="badge-meta" key={feature.id}>
                    <i className={feature.icon} />
                    {feature.name}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-5">
          {model.usage ? (
            <div className="aig-sect">
              <h6 className="aig-sect-title">
                <i className="ti ti-gauge" />
                Usage
              </h6>
              <div className="aig-budget">
                <span className={`aig-column aig-p-${usageShare} aig-q-100`}>
                  <span />
                </span>
                <div className="aig-budget-facts">
                  <div>
                    <span>Tokens this month</span>
                    <b>{millions(model.usage.tokens)}</b>
                  </div>
                  <div>
                    <span>Requests</span>
                    <b>{tokens(model.usage.requests)}</b>
                  </div>
                  <div>
                    <span>Average latency</span>
                    <b>{model.usage.latency}</b>
                  </div>
                  <div>
                    <span>Failure rate</span>
                    <b>{model.usage.failureRate}</b>
                  </div>
                  <div>
                    <span>Cost</span>
                    <b>{model.usage.cost}</b>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="aig-sect">
            <h6 className="aig-sect-title">
              <i className="ti ti-circle-check" />
              Validation
            </h6>
            {validationFor(model).map((check) => (
              <div className={`aig-check ${check.tone}`} key={check.id}>
                <i className={check.tone ? 'ti ti-alert-circle' : 'ti ti-circle-check'} />
                <div>
                  {check.title}
                  <span>{check.detail}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="aig-sect">
            <h6 className="aig-sect-title">
              <i className="ti ti-hierarchy-2" />
              Dependencies
            </h6>
            <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
              <span className="badge-meta">
                <i className="ti ti-plug-connected" />
                {model.provider} provider
              </span>
              <span className="badge-meta">
                <i className="ti ti-file-text" />
                {prompts.length} prompt template{prompts.length === 1 ? '' : 's'}
              </span>
              <span className="badge-meta">
                <i className="ti ti-robot" />
                {automations.length} automations
              </span>
              <span className="badge-meta">
                <i className="ti ti-shield-lock" />
                Masking rules
              </span>
            </div>
            <p className="fs-12 text-muted mb-0">
              Changing the default model changes the wording of every future finding. Findings
              already produced are not regenerated, so a report card and a risk case from the same
              week may read differently.
            </p>
          </div>

          <div className="aig-sect">
            <h6 className="aig-sect-title">
              <i className="ti ti-file-search" />
              Audit history
            </h6>
            {historyOf(model).map((entry) => (
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
        </div>
      </div>
    </Offcanvas>
  );
};

export default AiWorkspace;
