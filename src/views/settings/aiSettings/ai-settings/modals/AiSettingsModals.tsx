import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import { ActionLink } from '@components/workspace';
import {
  AUDIT_TOTAL,
  AUTOMATIONS,
  DEFAULT_MODEL,
  MODELS,
  PENDING,
  PROMPTS,
  PROVIDERS,
  STAFF_COUNT,
} from '../data/aiSettings.data';

/** Every dialog on the page, by the id the template gives it. */
export type AiDialog =
  | 'provider'
  | 'model'
  | 'prompt'
  | 'automation'
  | 'test'
  | 'export'
  | 'import'
  | 'reset'
  | 'publish'
  | null;

export interface AiSettingsModalsProps {
  open: AiDialog;
  onClose: () => void;
  onToast: (message: string) => void;
}

const useForm = <T extends Record<string, string>>(defaults: T, open: boolean) => {
  const [values, setValues] = useState<T>(defaults);
  const initial = JSON.stringify(defaults);
  useEffect(() => {
    if (open) setValues(JSON.parse(initial) as T);
  }, [open, initial]);
  const set = (key: keyof T) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));
  return [values, set] as const;
};

/** A checkbox row, the shape the template repeats down the Include lists. */
const Check = ({
  id,
  label,
  note,
  defaultChecked = false,
  disabled = false,
}: {
  id: string;
  label: string;
  note?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="form-check mb-2">
      <input
        className="form-check-input"
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(event) => setChecked(event.target.checked)}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
        {note ? <span className="text-muted"> {note}</span> : null}
      </label>
    </div>
  );
};

const Footer = ({
  onClose,
  submit,
  tone = 'btn-primary',
}: {
  onClose: () => void;
  submit: string;
  tone?: string;
}) => (
  <>
    <ActionLink className="btn btn-light me-2" onClick={onClose}>
      Cancel
    </ActionLink>
    <button type="submit" className={`btn ${tone}`}>
      {submit}
    </button>
  </>
);

const AiSettingsModals = ({ open, onClose, onToast }: AiSettingsModalsProps) => {
  const [provider, setProvider] = useForm(
    { name: PROVIDERS[0].name, auth: 'API key', endpoint: '', key: '' },
    open === 'provider',
  );
  const [model, setModel] = useForm(
    {
      id: DEFAULT_MODEL.id,
      purpose: 'General reasoning',
      temperature: DEFAULT_MODEL.temperature.toFixed(1),
      maxTokens: String(DEFAULT_MODEL.maxTokens),
      topP: DEFAULT_MODEL.topP.toFixed(1),
      timeout: String(DEFAULT_MODEL.timeout),
    },
    open === 'model',
  );

  const editing = PROMPTS.find((entry) => entry.id === 'homework-evaluation') ?? PROMPTS[0];
  const [prompt, setPrompt] = useForm(
    {
      name: editing.name,
      model: editing.feature === 'homework' ? 'claude-sonnet-4' : DEFAULT_MODEL.id,
      system: editing.system,
      task: editing.task.replace(/\{\{([a-z_]+)\}\}/g, '{$1}'),
    },
    open === 'prompt',
  );

  const job = AUTOMATIONS[0];
  const [automation, setAutomation] = useForm(
    { kind: job.kind, at: '11:15', model: DEFAULT_MODEL.id, scope: 'All classes' },
    open === 'automation',
  );

  const [exportForm, setExportForm] = useForm({ format: 'JSON — re-importable' }, open === 'export');
  const [importForm, setImportForm] = useForm(
    { source: 'Configuration file (.json)', file: '' },
    open === 'import',
  );
  const [publish, setPublish] = useForm({ when: 'Immediately', note: '' }, open === 'publish');
  const [testPrompt, setTestPrompt] = useForm(
    { text: 'Reply with the single word OK.' },
    open === 'test',
  );
  const [understood, setUnderstood] = useState(false);

  useEffect(() => {
    if (open === 'reset') setUnderstood(false);
  }, [open]);

  const variables = ['{student}', '{class}', '{assignment}', '{subject}', '{term}'];

  return (
    <>
      {/* Add AI provider */}
      <Modal
        open={open === 'provider'}
        onClose={onClose}
        title="Add AI provider"
        subtitle="Configured now, routed to later"
        onSubmit={(event) => {
          event.preventDefault();
          onToast(`${provider.name} added — run a connection test before routing to it`);
          onClose();
        }}
        footer={<Footer onClose={onClose} submit="Add provider" />}
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="aig-provider">
              Provider
            </label>
            <select
              className="form-select"
              id="aig-provider"
              value={provider.name}
              onChange={(event) => setProvider('name')(event.target.value)}
            >
              {PROVIDERS.map((entry) => (
                <option key={entry.id}>{entry.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="aig-auth">
              Authentication
            </label>
            <select
              className="form-select"
              id="aig-auth"
              value={provider.auth}
              onChange={(event) => setProvider('auth')(event.target.value)}
            >
              <option>API key</option>
              <option>Managed identity</option>
              <option>Service account</option>
              <option>None — trusted network</option>
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="aig-endpoint">
              Endpoint
            </label>
            <input
              type="text"
              className="form-control"
              id="aig-endpoint"
              value={provider.endpoint}
              onChange={(event) => setProvider('endpoint')(event.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="aig-key">
              API key
            </label>
            <input
              type="password"
              className="form-control"
              id="aig-key"
              value={provider.key}
              onChange={(event) => setProvider('key')(event.target.value)}
            />
          </div>
          <div className="col-12">
            <div className="aig-check">
              <i className="ti ti-shield-lock" />
              <div>
                A provider cannot be connected without a zero-retention endpoint
                <span>
                  The connection test checks for it, and refuses if the provider will not confirm
                  it. This is why DeepSeek is not connected.
                </span>
              </div>
            </div>
          </div>
          <div className="col-12">
            <Check id="aig-test-first" label="Run a connection test before saving" defaultChecked />
          </div>
        </div>
      </Modal>

      {/* Configure AI model */}
      <Modal
        open={open === 'model'}
        onClose={onClose}
        title="Configure AI model"
        subtitle={`${DEFAULT_MODEL.id} · ${DEFAULT_MODEL.provider}`}
        onSubmit={(event) => {
          event.preventDefault();
          onToast(`${model.id} saved`);
          onClose();
        }}
        footer={<Footer onClose={onClose} submit="Save model" />}
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="aig-model-id">
              Model identifier
            </label>
            <input
              type="text"
              className="form-control"
              id="aig-model-id"
              value={model.id}
              onChange={(event) => setModel('id')(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="aig-model-purpose">
              Purpose
            </label>
            <select
              className="form-select"
              id="aig-model-purpose"
              value={model.purpose}
              onChange={(event) => setModel('purpose')(event.target.value)}
            >
              <option>General reasoning</option>
              <option>Short high-volume work</option>
              <option>Long structured output</option>
              <option>On-premise only</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="aig-model-temp">
              Temperature
            </label>
            <input
              type="text"
              className="form-control"
              id="aig-model-temp"
              value={model.temperature}
              onChange={(event) => setModel('temperature')(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="aig-model-max">
              Maximum output tokens
            </label>
            <input
              type="text"
              className="form-control"
              id="aig-model-max"
              value={model.maxTokens}
              onChange={(event) => setModel('maxTokens')(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="aig-model-topp">
              Top-p
            </label>
            <input
              type="text"
              className="form-control"
              id="aig-model-topp"
              value={model.topP}
              onChange={(event) => setModel('topP')(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="aig-model-timeout">
              Request timeout (seconds)
            </label>
            <input
              type="text"
              className="form-control"
              id="aig-model-timeout"
              value={model.timeout}
              onChange={(event) => setModel('timeout')(event.target.value)}
            />
          </div>
          <div className="col-12">
            <p className="fs-12 text-muted mb-0">
              A lower temperature makes findings more repeatable, which matters when two teachers
              read the same case and expect the same wording. The committee set{' '}
              {DEFAULT_MODEL.temperature.toFixed(1)} in June for exactly that reason.
            </p>
          </div>
        </div>
      </Modal>

      {/* Edit prompt template */}
      <Modal
        open={open === 'prompt'}
        onClose={onClose}
        title="Edit prompt template"
        subtitle={`${editing.name} · v${editing.version} · ${editing.state.toLowerCase()}`}
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onToast(`${prompt.name} saved as v${editing.version + 1}`);
          onClose();
        }}
        footer={<Footer onClose={onClose} submit="Save template" />}
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="aig-prompt-name">
              Template name
            </label>
            <input
              type="text"
              className="form-control"
              id="aig-prompt-name"
              value={prompt.name}
              onChange={(event) => setPrompt('name')(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="aig-prompt-model">
              Model
            </label>
            <select
              className="form-select"
              id="aig-prompt-model"
              value={prompt.model}
              onChange={(event) => setPrompt('model')(event.target.value)}
            >
              {MODELS.filter((entry) => entry.enabled).map((entry) => (
                <option key={entry.id}>{entry.id}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="aig-prompt-system">
              System instruction — the boundary
            </label>
            <textarea
              className="form-control"
              rows={3}
              id="aig-prompt-system"
              value={prompt.system}
              onChange={(event) => setPrompt('system')(event.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="aig-prompt-task">
              Task
            </label>
            <textarea
              className="form-control"
              rows={4}
              id="aig-prompt-task"
              value={prompt.task}
              onChange={(event) => setPrompt('task')(event.target.value)}
            />
          </div>
          <div className="col-12">
            <span className="aig-lbl">Available variables</span>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {variables.map((variable) => (
                <span className="aig-chip is-plain" key={variable}>
                  {variable}
                </span>
              ))}
            </div>
          </div>
          <div className="col-12">
            <Check
              id="aig-prompt-version"
              label={`Save as a new version — v${editing.version + 1} — and keep v${editing.version} for rollback`}
              defaultChecked
            />
            <Check
              id="aig-prompt-publish"
              label="Publish immediately"
              note="— otherwise it is held as a draft"
            />
          </div>
        </div>
      </Modal>

      {/* Configure automation */}
      <Modal
        open={open === 'automation'}
        onClose={onClose}
        title="Configure automation"
        subtitle={`${job.name} · ${job.kind.toLowerCase()}`}
        onSubmit={(event) => {
          event.preventDefault();
          onToast(`${job.name} saved`);
          onClose();
        }}
        footer={<Footer onClose={onClose} submit="Save automation" />}
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="aig-auto-kind">
              Automation type
            </label>
            <select
              className="form-select"
              id="aig-auto-kind"
              value={automation.kind}
              onChange={(event) => setAutomation('kind')(event.target.value)}
            >
              <option>Scheduled</option>
              <option>Event-driven</option>
              <option>On submission</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="aig-auto-at">
              Runs at
            </label>
            <input
              type="text"
              className="form-control"
              id="aig-auto-at"
              value={automation.at}
              onChange={(event) => setAutomation('at')(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="aig-auto-model">
              Model
            </label>
            <select
              className="form-select"
              id="aig-auto-model"
              value={automation.model}
              onChange={(event) => setAutomation('model')(event.target.value)}
            >
              {MODELS.filter((entry) => entry.enabled).map((entry) => (
                <option key={entry.id}>{entry.id}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="aig-auto-scope">
              Scope
            </label>
            <select
              className="form-select"
              id="aig-auto-scope"
              value={automation.scope}
              onChange={(event) => setAutomation('scope')(event.target.value)}
            >
              <option>All classes</option>
              <option>Middle stage only</option>
              <option>Secondary only</option>
            </select>
          </div>
          <div className="col-12">
            <span className="aig-lbl">What the run may do</span>
            <Check
              id="aig-auto-findings"
              label="Produce findings for the class teacher"
              defaultChecked
            />
            <Check
              id="aig-auto-send"
              label="Send a message to a guardian"
              note="— blocked by the platform-wide policy"
              disabled
            />
            <Check
              id="aig-auto-skip"
              label="Skip the run if the queue is deeper than 200 jobs"
              defaultChecked
            />
          </div>
        </div>
      </Modal>

      {/* Test AI provider */}
      <Modal
        open={open === 'test'}
        onClose={onClose}
        title="Test AI provider"
        subtitle="No school data is sent"
        onSubmit={(event) => {
          event.preventDefault();
          onToast('Test run — all four checks passed');
        }}
        footer={<Footer onClose={onClose} submit="Run test again" />}
      >
        <p className="fs-13 text-muted">
          A fixed test prompt is sent with no student data in it at all. The response is discarded.
          This checks the route, the credentials and the retention header — nothing else.
        </p>
        <div className="mb-3">
          <label className="form-label" htmlFor="aig-test-prompt">
            Test prompt
          </label>
          <input
            type="text"
            className="form-control"
            id="aig-test-prompt"
            value={testPrompt.text}
            onChange={(event) => setTestPrompt('text')(event.target.value)}
          />
        </div>
        {[
          {
            id: 'tls',
            title: 'Endpoint reachable over TLS 1.3',
            detail: `${PROVIDERS[0].endpoint.split('/')[0]} · 2.4 s round trip.`,
          },
          { id: 'creds', title: 'Credentials accepted', detail: 'Key ending 7K2a.' },
          {
            id: 'retention',
            title: 'Zero-retention header confirmed',
            detail: 'The request will not be retained or trained on.',
          },
          {
            id: 'responded',
            title: 'Model responded as expected',
            detail: 'Returned OK in 1.1 s.',
          },
        ].map((check) => (
          <div className="aig-check" key={check.id}>
            <i className="ti ti-circle-check" />
            <div>
              {check.title}
              <span>{check.detail}</span>
            </div>
          </div>
        ))}
      </Modal>

      {/* Export AI settings */}
      <Modal
        open={open === 'export'}
        onClose={onClose}
        title="Export AI settings"
        subtitle="Configuration only — never credentials"
        onSubmit={(event) => {
          event.preventDefault();
          onToast(`AI settings exported as ${exportForm.format.split(' ')[0]}`);
          onClose();
        }}
        footer={<Footer onClose={onClose} submit="Export" />}
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="aig-export-format">
            Format
          </label>
          <select
            className="form-select"
            id="aig-export-format"
            value={exportForm.format}
            onChange={(event) => setExportForm('format')(event.target.value)}
          >
            <option>JSON — re-importable</option>
            <option>PDF — the AI governance document</option>
            <option>CSV — settings list only</option>
          </select>
        </div>
        <span className="aig-lbl">Include</span>
        <Check id="aig-export-routing" label="Providers, models and feature routing" defaultChecked />
        <Check id="aig-export-prompts" label="Prompt templates, all versions" defaultChecked />
        <Check
          id="aig-export-policy"
          label="Permissions, privacy rules and guardrails"
          defaultChecked
        />
        <Check id="aig-export-audit" label="Audit history" note={`— ${AUDIT_TOTAL} entries`} />
        <Check id="aig-export-keys" label="API keys — never exported" disabled />
        <p className="fs-12 text-muted mb-0 mt-2">
          The PDF is written as a governance statement rather than a settings dump, which is the
          form a board or an inspector asks for.
        </p>
      </Modal>

      {/* Import AI settings */}
      <Modal
        open={open === 'import'}
        onClose={onClose}
        title="Import AI settings"
        subtitle="From a file or another installation"
        onSubmit={(event) => {
          event.preventDefault();
          onToast('Import preview ready');
          onClose();
        }}
        footer={<Footer onClose={onClose} submit="Preview import" />}
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="aig-import-source">
            Source
          </label>
          <select
            className="form-select"
            id="aig-import-source"
            value={importForm.source}
            onChange={(event) => setImportForm('source')(event.target.value)}
          >
            <option>Configuration file (.json)</option>
            <option>Sunrise Public School</option>
            <option>Riverside Academy</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="aig-import-file">
            File
          </label>
          <input
            type="file"
            className="form-control"
            id="aig-import-file"
            onChange={(event) => setImportForm('file')(event.target.value)}
          />
        </div>
        <span className="aig-lbl">Include</span>
        <Check id="aig-import-prompts" label="Prompt templates" defaultChecked />
        <Check id="aig-import-models" label="Model settings and feature routing" defaultChecked />
        <Check
          id="aig-import-policy"
          label="Permissions and privacy rules"
          note="— these are a local decision"
        />
        <Check
          id="aig-import-providers"
          label="Provider connections"
          note="— credentials never travel"
          disabled
        />
        <div className="aig-check is-warn mt-2">
          <i className="ti ti-alert-circle" />
          <div>
            Importing permissions from another school is rarely right
            <span>
              Who may read a finding about a child is a decision each school makes for itself, and it
              is off by default here for that reason.
            </span>
          </div>
        </div>
      </Modal>

      {/* Reset configuration */}
      <Modal
        open={open === 'reset'}
        onClose={onClose}
        title="Reset configuration"
        subtitle="Returns AI settings to the shipped defaults"
        onSubmit={(event) => {
          event.preventDefault();
          onToast('AI configuration returned to the shipped defaults');
          onClose();
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-danger" disabled={!understood}>
              Reset configuration
            </button>
          </>
        }
      >
        <p className="fs-13 text-muted">
          Every setting on this page returns to the default. Providers are disconnected, prompt
          templates return to their shipped version and every feature is switched off until it is
          configured again.
        </p>
        <div className="aig-check">
          <i className="ti ti-circle-check" />
          <div>
            Student records are untouched
            <span>Nothing in the school database is affected.</span>
          </div>
        </div>
        <div className="aig-check">
          <i className="ti ti-circle-check" />
          <div>
            Findings already produced are kept
            <span>They stay attached to the records they were made about.</span>
          </div>
        </div>
        <div className="aig-check is-warn">
          <i className="ti ti-alert-circle" />
          <div>
            {PROMPTS.length} prompt templates lose their local edits
            <span>
              {PROMPTS.filter((entry) => entry.version >= 3).length} of them are at v3 or later,
              meaning eighteen months of refinement written by the academic team.
            </span>
          </div>
        </div>
        <div className="aig-check is-warn">
          <i className="ti ti-alert-circle" />
          <div>
            The guardrails return to the shipped set
            <span>The five committee decisions on the General tab would be reversed.</span>
          </div>
        </div>
        <div className="form-check mt-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="aig-reset-understood"
            checked={understood}
            onChange={(event) => setUnderstood(event.target.checked)}
          />
          <label className="form-check-label" htmlFor="aig-reset-understood">
            I understand the academic team’s work on these templates will be lost
          </label>
        </div>
      </Modal>

      {/* Publish configuration */}
      <Modal
        open={open === 'publish'}
        onClose={onClose}
        title="Publish configuration"
        subtitle={`${PENDING.length} drafts · live for ${STAFF_COUNT} staff`}
        onSubmit={(event) => {
          event.preventDefault();
          onToast(`${PENDING.length} changes published ${publish.when.toLowerCase()}`);
          onClose();
        }}
        footer={<Footer onClose={onClose} submit="Publish" />}
      >
        <p className="fs-13 text-muted">
          Publishing applies all three at once and tells every teacher what changed. Until then none
          of them affects anything.
        </p>
        {PENDING.map((change) => (
          <div className="aig-check" key={change.id}>
            <i className="ti ti-circle-check" />
            <div>
              {change.what}
              <span>{change.effect}</span>
            </div>
          </div>
        ))}
        <div className="mb-3 mt-3">
          <label className="form-label" htmlFor="aig-publish-when">
            Apply
          </label>
          <select
            className="form-select"
            id="aig-publish-when"
            value={publish.when}
            onChange={(event) => setPublish('when')(event.target.value)}
          >
            <option>Immediately</option>
            <option>At midnight tonight</option>
            <option>At the start of next month</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="aig-publish-note">
            Publication note
          </label>
          <textarea
            className="form-control"
            rows={2}
            id="aig-publish-note"
            value={publish.note}
            onChange={(event) => setPublish('note')(event.target.value)}
          />
        </div>
        <Check id="aig-publish-notify" label="Notify all teaching staff of the change" defaultChecked />
        <Check
          id="aig-publish-restore"
          label="Keep the current configuration as a restore point"
          defaultChecked
        />
      </Modal>
    </>
  );
};

export default AiSettingsModals;
