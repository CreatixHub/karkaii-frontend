import { Fragment, useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import { ActionLink } from '@components/workspace';
import {
  DELTAS,
  DRAFT_CHANGES,
  ENABLE_TARGETS,
  ENVIRONMENT,
  ENVIRONMENTS,
  EXPORT_FORMATS,
  FAMILIES_AFFECTED,
  FINANCIAL_YEAR,
  IMPORT_SOURCES,
  LAST_UPDATED,
  PROVIDERS,
  PUBLISH_WHEN,
  RULES,
  RUNNING_AUTOMATIONS,
  SETTINGS_ON_RECORD,
  UPDATED_BY,
  WORKSPACE_AUDIT,
  WORKSPACE_CHECKS,
  WORKSPACE_DEPENDENCIES,
  WORKSPACE_DETAIL,
  WORKSPACE_SETTINGS,
  WORKSPACE_USAGE,
} from '../data/payment.data';

export type PaymentModalId =
  | 'edit'
  | 'restore'
  | 'import'
  | 'export'
  | 'enable'
  | 'disable'
  | 'preview'
  | 'publish';

export interface PaymentModalsProps {
  active: PaymentModalId | null;
  onClose: () => void;
  panelOpen: boolean;
  onClosePanel: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
}

/* ----------------------------- Small helpers ----------------------------- */

const Field = ({
  label,
  children,
  span = 'col-md-6',
}: {
  label: string;
  children: React.ReactNode;
  span?: string;
}) => (
  <div className={span}>
    <label className="form-label">{label}</label>
    {children}
  </div>
);

const Select = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
    {options.map((option) => (
      <option key={option}>{option}</option>
    ))}
  </select>
);

const Check = ({
  id,
  label,
  checked,
  onChange,
  last = false,
}: {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: () => void;
  last?: boolean;
}) => (
  <div className={`form-check ${last ? 'mb-0' : 'mb-2'}`}>
    <input
      className="form-check-input"
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
    />
    <label className="form-check-label fs-13" htmlFor={id}>
      {label}
    </label>
  </div>
);

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="fin-row">
    <div className="fin-row-key">
      <strong>{label}</strong>
    </div>
    <div className="fin-row-ctl">
      <span className="fs-13 fw-medium">{value}</span>
    </div>
  </div>
);

/** The before → after pair the preview and the change log both print. */
const Delta = ({ from, to }: { from: string; to: string }) => (
  <span className="fin-delta">
    <del>{from}</del>
    <i className="ti ti-arrow-narrow-right" />
    <ins>{to}</ins>
  </span>
);

const Footer = ({
  icon,
  label,
  onClose,
  danger = false,
}: {
  icon: string;
  label: string;
  onClose: () => void;
  danger?: boolean;
}) => (
  <>
    <ActionLink className="btn btn-light me-2" onClick={onClose}>
      Cancel
    </ActionLink>
    <button
      type="submit"
      className={`btn ${danger ? 'btn-danger' : 'btn-primary'} d-inline-flex align-items-center`}
    >
      <i className={`${icon} me-1`} />
      {label}
    </button>
  </>
);

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

/* -------------------------------- Dialogs -------------------------------- */

const PaymentModals = ({
  active,
  onClose,
  panelOpen,
  onClosePanel,
  onToast,
}: PaymentModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const [flags, setFlags] = useState<Record<string, boolean>>({
    understand: false,
    importGeneral: true,
    importRules: true,
    importKeys: false,
    exportSettings: true,
    exportRules: true,
    exportHistory: false,
    exportKeys: false,
    notify: true,
    restorePoint: true,
  });
  const toggle = (key: string) => () => setFlags((current) => ({ ...current, [key]: !current[key] }));

  const [edit, setEdit] = useForm(
    {
      name: `Payment settings · ${FINANCIAL_YEAR}`,
      environment: ENVIRONMENT,
      effectiveFrom: '28 Jul 2026',
      note: 'Raised the single payment ceiling and moved the convenience fee to the school.',
    },
    active === 'edit',
  );

  const [importForm, setImport] = useForm(
    { source: IMPORT_SOURCES[0], file: '' },
    active === 'import',
  );

  const [exportForm, setExport] = useForm({ format: EXPORT_FORMATS[0] }, active === 'export');

  const [enable, setEnable] = useForm({ target: ENABLE_TARGETS[0] }, active === 'enable');

  const [disable, setDisable] = useForm({ reason: '' }, active === 'disable');

  const [publish, setPublish] = useForm(
    { when: PUBLISH_WHEN[0], note: '' },
    active === 'publish',
  );

  const primary = PROVIDERS.find((row) => row.primary) ?? PROVIDERS[0];

  return (
    <>
      {/* ------------------------------- Edit -------------------------------- */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit configuration"
        subtitle={`Payment settings · ${FINANCIAL_YEAR}`}
        onSubmit={submit('Configuration saved as a draft.')}
        footer={<Footer icon="ti ti-device-floppy" label="Save changes" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Configuration name" span="col-12">
            <input
              type="text"
              className="form-control"
              value={edit.name}
              onChange={(event) => setEdit('name')(event.target.value)}
            />
          </Field>
          <Field label="Environment">
            <Select
              value={edit.environment}
              onChange={setEdit('environment')}
              options={ENVIRONMENTS}
            />
          </Field>
          <Field label="Effective from">
            <DateField value={edit.effectiveFrom} onChange={setEdit('effectiveFrom')} />
          </Field>
          <Field label="Change note" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={edit.note}
              onChange={(event) => setEdit('note')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      {/* ------------------------------ Restore ------------------------------ */}
      <Modal
        open={active === 'restore'}
        onClose={onClose}
        title="Restore defaults"
        subtitle="This unpublishes the current configuration"
        onSubmit={submit('Configuration restored to the template defaults.')}
        footer={<Footer icon="ti ti-rotate-2" label="Restore defaults" onClose={onClose} danger />}
      >
        <p className="fs-13 text-muted">
          Every payment setting returns to the template default. Providers stay connected but are
          switched off until you enable them again.
        </p>
        <span className="fin-lbl">What will change</span>
        <ul className="fin-note-list mb-3">
          <li>{SETTINGS_ON_RECORD} settings across five sections</li>
          <li>{RULES.length} business rules disabled</li>
          <li>{RUNNING_AUTOMATIONS} automations switched off</li>
        </ul>
        <Check
          id="fin-understand"
          label="I understand collection will fall back to counter payments until a provider is re-enabled."
          checked={flags.understand}
          onChange={toggle('understand')}
          last
        />
      </Modal>

      {/* ------------------------------- Import ------------------------------ */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import settings"
        subtitle="From a file or another school"
        onSubmit={submit('Configuration imported as a draft.')}
        footer={<Footer icon="ti ti-upload" label="Import" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Source" span="col-12">
            <Select
              value={importForm.source}
              onChange={setImport('source')}
              options={IMPORT_SOURCES}
            />
          </Field>
          <Field label="Configuration file" span="col-12">
            <input type="file" className="form-control" />
          </Field>
          <div className="col-12">
            <span className="fin-lbl">Include</span>
            <Check
              id="fin-imp-general"
              label="General and default settings"
              checked={flags.importGeneral}
              onChange={toggle('importGeneral')}
            />
            <Check
              id="fin-imp-rules"
              label="Business rules and automations"
              checked={flags.importRules}
              onChange={toggle('importRules')}
            />
            <Check
              id="fin-imp-keys"
              label={
                <>
                  Provider credentials{' '}
                  <span className="text-muted">— keys are never carried across schools</span>
                </>
              }
              checked={flags.importKeys}
              onChange={toggle('importKeys')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- Export ------------------------------ */}
      <Modal
        open={active === 'export'}
        onClose={onClose}
        title="Export settings"
        subtitle="A snapshot of this configuration"
        onSubmit={submit('Configuration exported.')}
        footer={<Footer icon="ti ti-download" label="Export" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Format" span="col-12">
            <Select
              value={exportForm.format}
              onChange={setExport('format')}
              options={EXPORT_FORMATS}
            />
          </Field>
          <div className="col-12">
            <span className="fin-lbl">Contents</span>
            <Check
              id="fin-exp-settings"
              label={`All ${SETTINGS_ON_RECORD} settings`}
              checked={flags.exportSettings}
              onChange={toggle('exportSettings')}
            />
            <Check
              id="fin-exp-rules"
              label="Business rules and automations"
              checked={flags.exportRules}
              onChange={toggle('exportRules')}
            />
            <Check
              id="fin-exp-history"
              label="Change history"
              checked={flags.exportHistory}
              onChange={toggle('exportHistory')}
            />
            <Check
              id="fin-exp-keys"
              label={<span className="text-muted">Gateway keys — never exported</span>}
              checked={flags.exportKeys}
              onChange={toggle('exportKeys')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- Enable ------------------------------ */}
      <Modal
        open={active === 'enable'}
        onClose={onClose}
        title="Enable feature"
        subtitle="Connect and switch on"
        onSubmit={submit('Feature will switch on when the configuration is published.')}
        footer={<Footer icon="ti ti-plus" label="Enable" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Feature or provider" span="col-12">
            <Select value={enable.target} onChange={setEnable('target')} options={ENABLE_TARGETS} />
          </Field>
        </div>
        <span className="fin-lbl mt-3 d-block">Requires</span>
        <ul className="fin-note-list mb-3">
          <li>
            <strong>Refund settings</strong>{' '}
            <span className="text-muted">— not yet published</span>
          </li>
          <li>
            <strong>Finance approvals</strong> <span className="text-muted">— configured</span>
          </li>
        </ul>
        <p className="fs-12 text-muted mb-0">
          Enabling takes effect on publish, not immediately.
        </p>
      </Modal>

      {/* ------------------------------ Disable ------------------------------ */}
      <Modal
        open={active === 'disable'}
        onClose={onClose}
        title="Disable feature"
        subtitle={`${primary.name} · primary provider`}
        onSubmit={submit(`${primary.name} disabled. The change is held until you publish.`)}
        footer={<Footer icon="ti ti-plug-connected-x" label="Disable" onClose={onClose} danger />}
      >
        <p className="fs-13 text-muted">
          Disabling the primary provider stops {primary.share}% of online collection. Parents will
          be offered the remaining live routes.
        </p>
        <span className="fin-lbl">Affected</span>
        <ul className="fin-note-list mb-3">
          <li>3 business rules lose their route</li>
          <li>2 automations stop running</li>
          <li>18 payments are currently pending on this gateway</li>
        </ul>
        <Field label="Reason for the audit record" span="col-12">
          <textarea
            className="form-control"
            rows={2}
            value={disable.reason}
            onChange={(event) => setDisable('reason')(event.target.value)}
          />
        </Field>
      </Modal>

      {/* ------------------------------ Preview ------------------------------ */}
      <Modal
        open={active === 'preview'}
        onClose={onClose}
        title="Preview changes"
        subtitle="What publishing would do"
        dialogClassName="modal-lg"
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </ActionLink>
            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center"
              onClick={() => {
                onToast('Opening the publish dialog');
                onClose();
              }}
            >
              <i className="ti ti-rocket me-1" />
              Continue to publish
            </button>
          </>
        }
      >
        <span className="fin-badge is-review mb-3 d-inline-block">
          {DRAFT_CHANGES} draft changes
        </span>
        {DELTAS.map((delta) => (
          <div className="fin-row" key={delta.setting}>
            <div className="fin-row-key">
              <strong>{delta.setting}</strong>
              <span>
                {delta.by} · {delta.on}
              </span>
            </div>
            <div className="fin-row-ctl">
              <Delta from={delta.from} to={delta.to} />
            </div>
          </div>
        ))}
        <span className="fin-lbl mt-3 d-block">Who this reaches</span>
        <p className="fs-13 text-muted mb-0">
          {FAMILIES_AFFECTED.toLocaleString('en-IN')} families with an open fee balance, from the
          moment you publish. Payments already in progress finish under the current settings.
        </p>
      </Modal>

      {/* ------------------------------ Publish ------------------------------ */}
      <Modal
        open={active === 'publish'}
        onClose={onClose}
        title="Publish configuration"
        subtitle={`${DRAFT_CHANGES} draft changes · ${ENVIRONMENT.toLowerCase()}`}
        onSubmit={submit('Configuration published. The gateway refreshes within two minutes.')}
        footer={<Footer icon="ti ti-rocket" label="Publish" onClose={onClose} />}
      >
        <p className="fs-13 text-muted">
          Publishing applies these settings to every payer immediately. The gateway configuration
          refreshes within two minutes.
        </p>
        <div className="row g-3">
          <Field label="Apply" span="col-12">
            <Select value={publish.when} onChange={setPublish('when')} options={PUBLISH_WHEN} />
          </Field>
          <Field label="Publication note" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={publish.note}
              onChange={(event) => setPublish('note')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="fin-pub-notify"
              label="Notify the accounts desk and the principal"
              checked={flags.notify}
              onChange={toggle('notify')}
            />
            <Check
              id="fin-pub-restore"
              label="Keep the current configuration as a restore point"
              checked={flags.restorePoint}
              onChange={toggle('restorePoint')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ------------------------- Provider workspace ------------------------ */}
      <Offcanvas
        open={panelOpen}
        onClose={onClosePanel}
        title={`${primary.name} — gateway configuration`}
        placement="end"
        labelledById="finWorkspaceLabel"
        footer={
          <div className="d-flex gap-2">
            <ActionLink className="btn btn-light" onClick={onClosePanel}>
              Close
            </ActionLink>
            <button
              type="button"
              className="btn btn-outline-danger d-inline-flex align-items-center"
              onClick={() => {
                onClosePanel();
                onToast('Opening the disable dialog', 'warning');
              }}
            >
              <i className="ti ti-plug-connected-x me-1" />
              Disable provider
            </button>
            <button
              type="button"
              className="btn btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
              onClick={() => {
                onToast('Provider configuration saved as a draft');
                onClosePanel();
              }}
            >
              <i className="ti ti-device-floppy me-1" />
              Save configuration
            </button>
          </div>
        }
      >
        <p className="fs-12 text-muted">
          Primary provider · {primary.mode.toLowerCase()} · last changed {LAST_UPDATED.split(',')[0]}{' '}
          by {UPDATED_BY}
        </p>

        <span className="fin-lbl">Configuration details</span>
        <div className="mb-3">
          {WORKSPACE_DETAIL.map((entry) => (
            <Row key={entry.label} label={entry.label} value={entry.value} />
          ))}
          <Row label="Key" value={<code>{primary.key}</code>} />
        </div>

        <span className="fin-lbl">Settings</span>
        <div className="mb-3">
          {WORKSPACE_SETTINGS.map((row) => (
            <div className="fin-row" key={row.key}>
              <div className="fin-row-key">
                <strong>{row.key}</strong>
                <span>{row.note}</span>
              </div>
              <div className="fin-row-ctl">
                {row.kind === 'switch' ? (
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id={`fin-ws-${row.key.replace(/\s+/g, '-').toLowerCase()}`}
                      defaultChecked={row.on}
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor={`fin-ws-${row.key.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      Enable
                    </label>
                  </div>
                ) : (
                  <select className="fin-select w-auto" aria-label={row.key} defaultValue={row.options?.[0]}>
                    {(row.options ?? []).map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>

        <span className="fin-lbl">Usage</span>
        <div className="mb-3">
          {WORKSPACE_USAGE.map((entry) => (
            <Row key={entry.label} label={entry.label} value={entry.value} />
          ))}
          <Row label="Share of this year’s collection" value={`${primary.share}%`} />
        </div>

        <span className="fin-lbl">Validation</span>
        <div className="mb-3">
          {WORKSPACE_CHECKS.map((check) => (
            <div className={`fin-check${check.passed ? '' : ' is-warn'}`} key={check.label}>
              <i className={check.passed ? 'ti ti-circle-check' : 'ti ti-alert-circle'} />
              <div>
                {check.label}
                <span>{check.note}</span>
              </div>
            </div>
          ))}
        </div>

        <span className="fin-lbl">Dependencies</span>
        <div className="fin-deps mb-2">
          {WORKSPACE_DEPENDENCIES.map((dep) => (
            <span className="fin-dep" key={dep}>
              <i className="ti ti-link" />
              {dep}
            </span>
          ))}
        </div>
        <p className="fs-12 text-muted">
          Disabling this provider would leave three business rules and two automations without a
          live route.
        </p>

        <span className="fin-lbl">Audit history</span>
        <div>
          {WORKSPACE_AUDIT.map((entry) => (
            <Fragment key={entry.date}>
              <div className="fin-row">
                <div className="fin-row-key">
                  <strong>{entry.what}</strong>
                  <span>{entry.who}</span>
                </div>
                <div className="fin-row-ctl">
                  <span className="fs-12 text-muted text-end">
                    {entry.date}
                    <br />
                    {entry.time}
                  </span>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </Offcanvas>
    </>
  );
};

export default PaymentModals;
