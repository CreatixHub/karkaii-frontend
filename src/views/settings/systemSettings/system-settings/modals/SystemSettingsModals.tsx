import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import { ActionLink } from '@components/workspace';
import {
  AUDIT_TOTAL,
  AVAILABLE_VERSION,
  BACKUPS,
  DISK_ALERT_AT,
  DRAFTS,
  INSTALLATION,
  LOG_RETENTION_DAYS,
  PARTITIONS,
  SCHOOLS,
  SERVICES,
  USERS,
  WORKERS_RESPONDING,
  WORKERS_TOTAL,
} from '../data/systemSettings.data';

export type SystemDialog =
  | 'edit'
  | 'maintenance'
  | 'backup'
  | 'restore'
  | 'services'
  | 'environment'
  | 'export'
  | 'import'
  | 'publish'
  | null;

export interface SystemSettingsModalsProps {
  open: SystemDialog;
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

const Note = ({
  tone = '',
  title,
  detail,
}: {
  tone?: string;
  title: string;
  detail: string;
}) => (
  <div className={`sys-check ${tone}`.trim()}>
    <i className={tone ? 'ti ti-alert-circle' : 'ti ti-circle-check'} />
    <div>
      {title}
      <span>{detail}</span>
    </div>
  </div>
);

const Footer = ({
  onClose,
  submit,
  tone = 'btn-primary',
  disabled = false,
}: {
  onClose: () => void;
  submit: string;
  tone?: string;
  disabled?: boolean;
}) => (
  <>
    <ActionLink className="btn btn-light me-2" onClick={onClose}>
      Cancel
    </ActionLink>
    <button type="submit" className={`btn ${tone}`} disabled={disabled}>
      {submit}
    </button>
  </>
);

const SIGNED_IN = 1284;
const OPEN_PAYMENTS = 18;

const SystemSettingsModals = ({ open, onClose, onToast }: SystemSettingsModalsProps) => {
  const [edit, setEdit] = useForm(
    { threshold: String(DISK_ALERT_AT), retention: String(LOG_RETENTION_DAYS), note: '' },
    open === 'edit',
  );
  const [maintenance, setMaintenance] = useForm(
    { duration: '30', allowList: '103.21.58.14, 103.21.58.15', message: '' },
    open === 'maintenance',
  );
  const [backup, setBackup] = useForm(
    { destination: 'S3 — ap-southeast-1 (second region)' },
    open === 'backup',
  );
  const [restore, setRestore] = useForm(
    { from: `${BACKUPS[0].at} — verified`, to: 'Staging — recommended' },
    open === 'restore',
  );
  const [services, setServices] = useForm(
    { service: 'Queue worker', instances: String(WORKERS_TOTAL), timeout: '300', memory: '512' },
    open === 'services',
  );
  const [environment, setEnvironment] = useForm(
    { value: INSTALLATION.environment, reason: '' },
    open === 'environment',
  );
  const [exportForm, setExportForm] = useForm(
    { format: 'JSON — re-importable' },
    open === 'export',
  );
  const [importForm, setImportForm] = useForm(
    { source: 'Configuration file (.json)', file: '' },
    open === 'import',
  );
  const [publish, setPublish] = useForm({ when: 'Immediately', note: '' }, open === 'publish');

  const [maintenanceConfirmed, setMaintenanceConfirmed] = useState(false);
  const [restoreConfirmed, setRestoreConfirmed] = useState(false);

  useEffect(() => {
    if (open === 'maintenance') setMaintenanceConfirmed(false);
    if (open === 'restore') setRestoreConfirmed(false);
  }, [open]);

  const database = PARTITIONS.find((part) => part.id === 'database');
  const media = PARTITIONS.find((part) => part.id === 'media');

  return (
    <>
      {/* Edit configuration */}
      <Modal
        open={open === 'edit'}
        onClose={onClose}
        title="Edit configuration"
        subtitle={`Storage · ${'/var/karkaii'}`}
        onSubmit={(event) => {
          event.preventDefault();
          onToast(`Log retention set to ${edit.retention} days`);
          onClose();
        }}
        footer={<Footer onClose={onClose} submit="Save" />}
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="sys-threshold">
              Disk alert threshold (%)
            </label>
            <input
              type="text"
              className="form-control"
              id="sys-threshold"
              value={edit.threshold}
              onChange={(event) => setEdit('threshold')(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sys-retention">
              Log retention (days)
            </label>
            <input
              type="text"
              className="form-control"
              id="sys-retention"
              value={edit.retention}
              onChange={(event) => setEdit('retention')(event.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="sys-note">
              Change note
            </label>
            <textarea
              className="form-control"
              rows={2}
              id="sys-note"
              value={edit.note}
              onChange={(event) => setEdit('note')(event.target.value)}
            />
          </div>
          <div className="col-12">
            <Note
              tone="is-warn"
              title="Reducing log retention removes files immediately"
              detail="The nightly cleanup deletes anything older than the new value on its next run. It cannot be undone."
            />
            <Check id="sys-edit-draft" label="Hold as a draft rather than applying now" />
          </div>
        </div>
      </Modal>

      {/* Enable maintenance mode */}
      <Modal
        open={open === 'maintenance'}
        onClose={onClose}
        title="Enable maintenance mode"
        subtitle="This closes the platform for everyone"
        onSubmit={(event) => {
          event.preventDefault();
          onToast('Maintenance mode enabled — the platform is closed');
          onClose();
        }}
        footer={
          <Footer
            onClose={onClose}
            submit="Enable maintenance mode"
            tone="btn-danger"
            disabled={!maintenanceConfirmed}
          />
        }
      >
        <p className="fs-13 text-muted">
          All {USERS.toLocaleString('en-US')} users across {SCHOOLS.length} schools are signed out
          and shown a holding page. Only allow-listed addresses keep access, and there is no way
          back in from an address that is not on that list.
        </p>
        <Note
          tone="is-warn"
          title={`${SIGNED_IN.toLocaleString('en-US')} users are signed in right now`}
          detail="Each loses unsaved work at the moment this is applied."
        />
        <Note
          tone="is-warn"
          title="Fee payments in progress will fail"
          detail={`${OPEN_PAYMENTS} are open at the gateway. They resume once the platform returns.`}
        />
        <Note
          title="Queued email and SMS are held, not lost"
          detail="They send when the platform returns."
        />
        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <label className="form-label" htmlFor="sys-duration">
              Expected duration (minutes)
            </label>
            <input
              type="text"
              className="form-control"
              id="sys-duration"
              value={maintenance.duration}
              onChange={(event) => setMaintenance('duration')(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sys-allow">
              Allow-listed addresses
            </label>
            <input
              type="text"
              className="form-control"
              id="sys-allow"
              value={maintenance.allowList}
              onChange={(event) => setMaintenance('allowList')(event.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="sys-holding">
              Message on the holding page
            </label>
            <textarea
              className="form-control"
              rows={2}
              id="sys-holding"
              value={maintenance.message}
              onChange={(event) => setMaintenance('message')(event.target.value)}
            />
          </div>
        </div>
        <div className="form-check mt-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="sys-maintenance-confirm"
            checked={maintenanceConfirmed}
            onChange={(event) => setMaintenanceConfirmed(event.target.checked)}
          />
          <label className="form-check-label" htmlFor="sys-maintenance-confirm">
            I have confirmed my own address is on the allow-list
          </label>
        </div>
      </Modal>

      {/* Back up system */}
      <Modal
        open={open === 'backup'}
        onClose={onClose}
        title="Back up system"
        subtitle="Runs now, outside the nightly schedule"
        onSubmit={(event) => {
          event.preventDefault();
          onToast('Backup started — about six minutes');
          onClose();
        }}
        footer={<Footer onClose={onClose} submit="Start backup" />}
      >
        <span className="sys-lbl">Include</span>
        <Check
          id="sys-backup-db"
          label="Database"
          note={`— about ${database?.size ?? 0} GB`}
          defaultChecked
        />
        <Check
          id="sys-backup-files"
          label="Uploaded files"
          note={`— about ${media?.size ?? 0} GB`}
          defaultChecked
        />
        <Check id="sys-backup-config" label="Configuration" defaultChecked />
        <Check id="sys-backup-logs" label="Logs" note="— rarely worth restoring" />
        <div className="mb-3 mt-3">
          <label className="form-label" htmlFor="sys-backup-dest">
            Destination
          </label>
          <select
            className="form-select"
            id="sys-backup-dest"
            value={backup.destination}
            onChange={(event) => setBackup('destination')(event.target.value)}
          >
            <option>S3 — ap-southeast-1 (second region)</option>
            <option>S3 — ap-south-1 (same region)</option>
            <option>Local disk</option>
          </select>
        </div>
        <Note
          title="A full backup takes about six minutes"
          detail="The platform stays available throughout, but disk I/O is heavier than usual."
        />
      </Modal>

      {/* Restore configuration */}
      <Modal
        open={open === 'restore'}
        onClose={onClose}
        title="Restore configuration"
        subtitle="Replaces every setting on this page"
        onSubmit={(event) => {
          event.preventDefault();
          onToast(`Configuration restored to ${restore.to.split(' — ')[0]}`);
          onClose();
        }}
        footer={
          <Footer
            onClose={onClose}
            submit="Restore"
            tone="btn-danger"
            disabled={!restoreConfirmed}
          />
        }
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="sys-restore-from">
              Restore from
            </label>
            <select
              className="form-select"
              id="sys-restore-from"
              value={restore.from}
              onChange={(event) => setRestore('from')(event.target.value)}
            >
              {BACKUPS.slice(0, 2).map((entry) => (
                <option key={entry.id}>{entry.at} — verified</option>
              ))}
              <option>24 Jul 2026 — weekly archive</option>
              <option>Shipped defaults</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sys-restore-to">
              Restore to
            </label>
            <select
              className="form-select"
              id="sys-restore-to"
              value={restore.to}
              onChange={(event) => setRestore('to')(event.target.value)}
            >
              <option>Staging — recommended</option>
              <option>Production</option>
            </select>
          </div>
        </div>
        <div className="mt-3">
          <Note
            title="Data is untouched"
            detail="Only the settings on this page are replaced. No school, user or record is affected."
          />
          <Note
            tone="is-warn"
            title="Restoring to production needs a second approver"
            detail="The Principal or the other Super Administrator."
          />
          <Note
            tone="is-warn"
            title="This restore has never been tested"
            detail="No restore drill has been run on this installation. Restoring to staging first would establish that the archive actually opens."
          />
        </div>
        <div className="form-check mt-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="sys-restore-confirm"
            checked={restoreConfirmed}
            onChange={(event) => setRestoreConfirmed(event.target.checked)}
          />
          <label className="form-check-label" htmlFor="sys-restore-confirm">
            I understand the current configuration is replaced
          </label>
        </div>
      </Modal>

      {/* Configure platform services */}
      <Modal
        open={open === 'services'}
        onClose={onClose}
        title="Configure platform services"
        subtitle={`Queue workers · ${WORKERS_RESPONDING} of ${WORKERS_TOTAL} responding`}
        onSubmit={(event) => {
          event.preventDefault();
          onToast(`${services.service} settings applied`);
          onClose();
        }}
        footer={<Footer onClose={onClose} submit="Apply" />}
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="sys-service">
              Service
            </label>
            <select
              className="form-select"
              id="sys-service"
              value={services.service}
              onChange={(event) => setServices('service')(event.target.value)}
            >
              {SERVICES.map((service) => (
                <option key={service.id}>{service.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sys-instances">
              Instances
            </label>
            <input
              type="text"
              className="form-control"
              id="sys-instances"
              value={services.instances}
              onChange={(event) => setServices('instances')(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sys-job-timeout">
              Job timeout (seconds)
            </label>
            <input
              type="text"
              className="form-control"
              id="sys-job-timeout"
              value={services.timeout}
              onChange={(event) => setServices('timeout')(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sys-memory">
              Memory limit (MB)
            </label>
            <input
              type="text"
              className="form-control"
              id="sys-memory"
              value={services.memory}
              onChange={(event) => setServices('memory')(event.target.value)}
            />
          </div>
          <div className="col-12">
            <Check
              id="sys-rolling"
              label="Rolling restart — finish jobs in flight before stopping"
              defaultChecked
            />
            <Check id="sys-auto-restart" label="Restart automatically if a worker stops responding" />
            <p className="fs-12 text-muted mb-0">
              The last option would have recovered worker 4 on its own at 00:12. It is off on this
              installation and turning it on is the smaller half of that fix.
            </p>
          </div>
        </div>
      </Modal>

      {/* Update environment */}
      <Modal
        open={open === 'environment'}
        onClose={onClose}
        title="Update environment"
        subtitle={`${INSTALLATION.environment} · ${INSTALLATION.region}`}
        onSubmit={(event) => {
          event.preventDefault();
          onToast('Environment change requested — applied at the next deploy');
          onClose();
        }}
        footer={<Footer onClose={onClose} submit="Request change" />}
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="sys-env">
            Environment
          </label>
          <select
            className="form-select"
            id="sys-env"
            value={environment.value}
            onChange={(event) => setEnvironment('value')(event.target.value)}
          >
            <option>Production</option>
            <option>Staging</option>
          </select>
        </div>
        <Note
          tone="is-warn"
          title="Changing the environment changes behaviour everywhere"
          detail="Debug output, error detail, mail routing and the environment ribbon all follow this value. An installation marked staging will not send mail to real addresses."
        />
        <Note
          title="The value is read from the environment file"
          detail="This form writes a request for the change; it is applied at the next deploy rather than immediately."
        />
        <div className="mt-3">
          <label className="form-label" htmlFor="sys-env-reason">
            Reason for the audit record
          </label>
          <textarea
            className="form-control"
            rows={2}
            id="sys-env-reason"
            value={environment.reason}
            onChange={(event) => setEnvironment('reason')(event.target.value)}
          />
        </div>
      </Modal>

      {/* Export configuration */}
      <Modal
        open={open === 'export'}
        onClose={onClose}
        title="Export configuration"
        subtitle="Settings only — never secrets"
        onSubmit={(event) => {
          event.preventDefault();
          onToast(`Configuration exported as ${exportForm.format.split(' ')[0]}`);
          onClose();
        }}
        footer={<Footer onClose={onClose} submit="Export" />}
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="sys-export-format">
            Format
          </label>
          <select
            className="form-select"
            id="sys-export-format"
            value={exportForm.format}
            onChange={(event) => setExportForm('format')(event.target.value)}
          >
            <option>JSON — re-importable</option>
            <option>YAML</option>
            <option>PDF — for the IT audit</option>
          </select>
        </div>
        <span className="sys-lbl">Include</span>
        <Check
          id="sys-export-general"
          label="General, application and platform settings"
          defaultChecked
        />
        <Check
          id="sys-export-runtime"
          label="Performance, storage, cache and job settings"
          defaultChecked
        />
        <Check id="sys-export-security" label="Security, logging and API settings" defaultChecked />
        <Check
          id="sys-export-audit"
          label="Audit history"
          note={`— ${AUDIT_TOTAL.toLocaleString('en-US')} entries`}
        />
        <Check
          id="sys-export-secrets"
          label="Environment variables and secrets — never exported"
          disabled
        />
      </Modal>

      {/* Import configuration */}
      <Modal
        open={open === 'import'}
        onClose={onClose}
        title="Import configuration"
        subtitle="From another installation or a backup"
        onSubmit={(event) => {
          event.preventDefault();
          onToast('Import preview ready');
          onClose();
        }}
        footer={<Footer onClose={onClose} submit="Preview import" />}
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="sys-import-source">
            Source
          </label>
          <select
            className="form-select"
            id="sys-import-source"
            value={importForm.source}
            onChange={(event) => setImportForm('source')(event.target.value)}
          >
            <option>Configuration file (.json)</option>
            <option>Staging installation</option>
            <option>Backup — {BACKUPS[0].at.split(',')[0]}</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="sys-import-file">
            File
          </label>
          <input
            type="file"
            className="form-control"
            id="sys-import-file"
            onChange={(event) => setImportForm('file')(event.target.value)}
          />
        </div>
        <Check
          id="sys-import-preview"
          label="Preview the differences before applying anything"
          defaultChecked
        />
        <Check id="sys-import-drafts" label="Hold everything as drafts rather than publishing" defaultChecked />
        <Check
          id="sys-import-env"
          label="Include environment-specific values"
          note="— URLs and hosts differ between installations"
        />
        <Note
          tone="is-warn"
          title="Importing from staging carries staging values"
          detail="Application URL, mail routing and storage buckets would all point at staging unless the last option stays off."
        />
      </Modal>

      {/* Publish settings */}
      <Modal
        open={open === 'publish'}
        onClose={onClose}
        title="Publish settings"
        subtitle={`${DRAFTS} drafts · ${INSTALLATION.environment.toLowerCase()}`}
        onSubmit={(event) => {
          event.preventDefault();
          onToast(`${DRAFTS} drafts published ${publish.when.toLowerCase()}`);
          onClose();
        }}
        footer={<Footer onClose={onClose} submit="Publish" />}
      >
        <p className="fs-13 text-muted">
          Publishing applies both drafts at once and notifies every administrator on this
          installation. Until then neither is in effect anywhere.
        </p>
        <Note
          title={`Log retention ${LOG_RETENTION_DAYS} → 30 days`}
          detail="Returns roughly 40 GB on the next nightly cleanup."
        />
        <Note
          title="Automatic worker restart switched on"
          detail="A worker that stops responding would recover without anyone acting."
        />
        <div className="mb-3 mt-3">
          <label className="form-label" htmlFor="sys-publish-when">
            Apply
          </label>
          <select
            className="form-select"
            id="sys-publish-when"
            value={publish.when}
            onChange={(event) => setPublish('when')(event.target.value)}
          >
            <option>Immediately</option>
            <option>In tonight’s maintenance window</option>
            <option>On 16 Aug, with the upgrade</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="sys-publish-note">
            Publication note
          </label>
          <textarea
            className="form-control"
            rows={2}
            id="sys-publish-note"
            value={publish.note}
            onChange={(event) => setPublish('note')(event.target.value)}
          />
        </div>
        <Check
          id="sys-publish-restore"
          label="Keep the current configuration as a restore point"
          defaultChecked
        />
        <p className="fs-12 text-muted mb-0">
          {AVAILABLE_VERSION} is still to be taken; publishing these drafts does not schedule it.
        </p>
      </Modal>
    </>
  );
};

export default SystemSettingsModals;
