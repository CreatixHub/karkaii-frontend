import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import { ActionLink } from '@components/workspace';
import type { Notification } from '../data/notifications.data';
import { DELIVERY, PRIORITY_LABEL } from '../data/notifications.data';

export type NotificationModalId =
  | 'settings'
  | 'markAll'
  | 'archive'
  | 'share'
  | 'forward'
  | 'export'
  | 'delete'
  | 'detail';

export interface NotificationModalsProps {
  active: NotificationModalId | null;
  onClose: () => void;
  notification: Notification | null;
  /** Unread in the feed — what the mark-all dialog is about to clear. */
  unread: number;
  onMarkAll: () => void;
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
  label: string;
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

const Footer = ({
  label,
  onClose,
  danger = false,
}: {
  label: string;
  onClose: () => void;
  danger?: boolean;
}) => (
  <>
    <ActionLink className="btn btn-light me-2" onClick={onClose}>
      Cancel
    </ActionLink>
    <button type="submit" className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}>
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

const NotificationModals = ({
  active,
  onClose,
  notification,
  unread,
  onMarkAll,
  onToast,
}: NotificationModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const [flags, setFlags] = useState<Record<string, boolean>>({
    bypass: true,
    mentions: true,
    grouped: true,
    keepPinned: true,
    keepAction: true,
    autoArchive: false,
    exportAudit: true,
    exportFiles: false,
    understand: false,
  });
  const toggle = (key: string) => () => setFlags((current) => ({ ...current, [key]: !current[key] }));

  const [settings, setSettings] = useForm(
    {
      email: 'Daily at 07:00',
      sms: 'Critical alerts only',
      push: 'All priorities',
      whatsapp: 'Parent messages only',
      quietFrom: '21:00',
      quietUntil: '07:00',
    },
    active === 'settings',
  );

  const [markAll, setMarkAll] = useForm(
    { applyTo: `Everything unread · ${unread}`, keepUnread: 'Critical items · recommended' },
    active === 'markAll',
  );

  const [archive, setArchive] = useForm(
    { archive: 'All read notifications', keep: 'Pinned and action items', retention: '12 months' },
    active === 'archive',
  );

  const [share, setShare] = useForm(
    {
      with: 'Teena Mathew',
      include: 'Full details and attachments',
      channel: 'In-app',
      message:
        'Sharing this for visibility — the transport cause has been confirmed and the review is approved.',
    },
    active === 'share',
  );

  const [forward, setForward] = useForm(
    {
      to: 'Transport office',
      reason: 'Correct owner',
      priority: 'Keep as Critical',
      respondBy: '',
      note: 'Route 04 overran by an average of 22 minutes on nine of the eleven late marks. Requesting a schedule review.',
    },
    active === 'forward',
  );

  const [exportForm, setExport] = useForm(
    { contents: 'Everything in view', period: 'Last 7 days', format: 'PDF', deliver: 'Download' },
    active === 'export',
  );

  const [remove, setRemove] = useForm(
    { scope: 'This notification only', reason: 'Raised in error', note: '' },
    active === 'delete',
  );

  return (
    <>
      {/* ------------------------------ Settings ----------------------------- */}
      <Modal
        open={active === 'settings'}
        onClose={onClose}
        title="Notification Settings"
        subtitle="How and when each channel reaches you"
        dialogClassName="modal-lg"
        onSubmit={submit('Notification settings saved.')}
        footer={<Footer label="Save settings" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Email digest">
            <Select
              value={settings.email}
              onChange={setSettings('email')}
              options={['Daily at 07:00', 'Immediately', 'Weekly on Friday', 'Off']}
            />
          </Field>
          <Field label="SMS">
            <Select
              value={settings.sms}
              onChange={setSettings('sms')}
              options={['Critical alerts only', 'Critical and high', 'Off']}
            />
          </Field>
          <Field label="Push">
            <Select
              value={settings.push}
              onChange={setSettings('push')}
              options={['All priorities', 'High and above', 'Critical only', 'Off']}
            />
          </Field>
          <Field label="WhatsApp">
            <Select
              value={settings.whatsapp}
              onChange={setSettings('whatsapp')}
              options={['Parent messages only', 'All notifications', 'Off']}
            />
          </Field>
          <Field label="Quiet hours from">
            <input
              type="text"
              className="form-control"
              value={settings.quietFrom}
              onChange={(event) => setSettings('quietFrom')(event.target.value)}
            />
          </Field>
          <Field label="Quiet hours until">
            <input
              type="text"
              className="form-control"
              value={settings.quietUntil}
              onChange={(event) => setSettings('quietUntil')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="ntf-bypass"
              label="Emergency alerts bypass quiet hours"
              checked={flags.bypass}
              onChange={toggle('bypass')}
            />
            <Check
              id="ntf-mentions"
              label="Always notify me when I am mentioned"
              checked={flags.mentions}
              onChange={toggle('mentions')}
            />
            <Check
              id="ntf-grouped"
              label="Group notifications from the same module"
              checked={flags.grouped}
              onChange={toggle('grouped')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ----------------------------- Mark all ------------------------------ */}
      <Modal
        open={active === 'markAll'}
        onClose={onClose}
        title="Mark All Read"
        subtitle={`${unread} unread notifications will be marked as read`}
        onSubmit={(event) => {
          event.preventDefault();
          onMarkAll();
          onClose();
        }}
        footer={<Footer label="Mark as read" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Apply to" span="col-12">
            <Select
              value={markAll.applyTo}
              onChange={setMarkAll('applyTo')}
              options={[
                `Everything unread · ${unread}`,
                'This module only',
                'Low priority only',
                'Older than 7 days',
              ]}
            />
          </Field>
          <Field label="Keep unread" span="col-12">
            <Select
              value={markAll.keepUnread}
              onChange={setMarkAll('keepUnread')}
              options={[
                'Critical items · recommended',
                'Items that need action',
                'Nothing — mark all',
              ]}
            />
          </Field>
          <div className="col-12">
            <Check
              id="ntf-keep-pinned"
              label="Leave pinned notifications unread"
              checked={flags.keepPinned}
              onChange={toggle('keepPinned')}
            />
            <Check
              id="ntf-keep-action"
              label="Leave items that require action unread"
              checked={flags.keepAction}
              onChange={toggle('keepAction')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Archive ------------------------------ */}
      <Modal
        open={active === 'archive'}
        onClose={onClose}
        title="Archive Notifications"
        subtitle="Archived items stay searchable for 12 months"
        onSubmit={submit('Notifications archived.')}
        footer={<Footer label="Archive" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Archive" span="col-12">
            <Select
              value={archive.archive}
              onChange={setArchive('archive')}
              options={[
                'All read notifications',
                'Older than 30 days',
                'This module only',
                'Selected items',
              ]}
            />
          </Field>
          <Field label="Keep in the inbox">
            <Select
              value={archive.keep}
              onChange={setArchive('keep')}
              options={['Pinned and action items', 'Pinned only', 'Nothing']}
            />
          </Field>
          <Field label="Retention">
            <Select
              value={archive.retention}
              onChange={setArchive('retention')}
              options={['12 months', '6 months', '3 academic years']}
            />
          </Field>
          <div className="col-12">
            <Check
              id="ntf-auto-archive"
              label="Archive read notifications automatically after 30 days"
              checked={flags.autoArchive}
              onChange={toggle('autoArchive')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- Share ------------------------------- */}
      <Modal
        open={active === 'share'}
        onClose={onClose}
        title="Share Notification"
        subtitle="Sharing records your name in the audit history"
        onSubmit={submit('Notification shared.')}
        footer={<Footer label="Share" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Share with" span="col-12">
            <Select
              value={share.with}
              onChange={setShare('with')}
              options={['Teena Mathew', 'Attendance office', 'Head of year', 'Leadership team']}
            />
          </Field>
          <Field label="Include">
            <Select
              value={share.include}
              onChange={setShare('include')}
              options={[
                'Full details and attachments',
                'Summary only',
                'Details without attachments',
              ]}
            />
          </Field>
          <Field label="Channel">
            <Select
              value={share.channel}
              onChange={setShare('channel')}
              options={['In-app', 'Email', 'Both']}
            />
          </Field>
          <Field label="Message" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={share.message}
              onChange={(event) => setShare('message')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      {/* ------------------------------ Forward ------------------------------ */}
      <Modal
        open={active === 'forward'}
        onClose={onClose}
        title="Forward Notification"
        subtitle="The recipient becomes responsible for the next action"
        onSubmit={submit('Notification forwarded.')}
        footer={<Footer label="Forward" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Forward to" span="col-12">
            <Select
              value={forward.to}
              onChange={setForward('to')}
              options={['Transport office', 'Attendance office', 'Teena Mathew', 'Head of year']}
            />
          </Field>
          <Field label="Reason">
            <Select
              value={forward.reason}
              onChange={setForward('reason')}
              options={['Correct owner', 'Needs specialist input', 'For approval', 'For information']}
            />
          </Field>
          <Field label="Priority">
            <Select
              value={forward.priority}
              onChange={setForward('priority')}
              options={['Keep as Critical', 'High', 'Medium', 'Low']}
            />
          </Field>
          <Field label="Respond by" span="col-12">
            <input
              type="text"
              className="form-control"
              value={forward.respondBy}
              onChange={(event) => setForward('respondBy')(event.target.value)}
            />
          </Field>
          <Field label="Note" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={forward.note}
              onChange={(event) => setForward('note')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      {/* ------------------------------- Export ------------------------------ */}
      <Modal
        open={active === 'export'}
        onClose={onClose}
        title="Export Notifications"
        subtitle="Exports include the audit history for each item"
        onSubmit={submit('Notifications exported.')}
        footer={<Footer label="Export" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Contents">
            <Select
              value={exportForm.contents}
              onChange={setExport('contents')}
              options={['Everything in view', 'Unread only', 'This module only', 'Action items only']}
            />
          </Field>
          <Field label="Period">
            <Select
              value={exportForm.period}
              onChange={setExport('period')}
              options={['Last 7 days', 'Last 30 days', 'This term', 'All time']}
            />
          </Field>
          <Field label="Format">
            <Select
              value={exportForm.format}
              onChange={setExport('format')}
              options={['PDF', 'XLSX', 'CSV']}
            />
          </Field>
          <Field label="Deliver to">
            <Select
              value={exportForm.deliver}
              onChange={setExport('deliver')}
              options={['Download', 'Email to me', 'Shared drive']}
            />
          </Field>
          <div className="col-12">
            <Check
              id="ntf-export-audit"
              label="Include the audit history for each notification"
              checked={flags.exportAudit}
              onChange={toggle('exportAudit')}
            />
            <Check
              id="ntf-export-files"
              label="Include attachments"
              checked={flags.exportFiles}
              onChange={toggle('exportFiles')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- Delete ------------------------------ */}
      <Modal
        open={active === 'delete'}
        onClose={onClose}
        title="Delete Notification"
        subtitle="This cannot be undone and the audit entry is kept"
        onSubmit={submit('Notification deleted.')}
        footer={<Footer label="Delete notification" onClose={onClose} danger />}
      >
        <div className="row g-3">
          <Field label="Delete" span="col-12">
            <Select
              value={remove.scope}
              onChange={setRemove('scope')}
              options={['This notification only', 'All from this module', 'All read and archived']}
            />
          </Field>
          <Field label="Reason" span="col-12">
            <Select
              value={remove.reason}
              onChange={setRemove('reason')}
              options={['Raised in error', 'Duplicate', 'No longer relevant', 'Other']}
            />
          </Field>
          <Field label="Note for the audit record" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={remove.note}
              onChange={(event) => setRemove('note')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="ntf-understand"
              label="I understand this cannot be undone"
              checked={flags.understand}
              onChange={toggle('understand')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ------------------------- Notification panel ------------------------ */}
      <Offcanvas
        open={active === 'detail'}
        onClose={onClose}
        title={notification?.title ?? 'Notification'}
        placement="end"
        labelledById="notificationPanelLabel"
        footer={
          <div className="d-flex gap-2">
            <ActionLink className="btn btn-light" onClick={onClose}>
              Close
            </ActionLink>
            <button
              type="button"
              className="btn btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
              onClick={() => {
                onToast('Notification acknowledged');
                onClose();
              }}
            >
              <i className="ti ti-check me-1" />
              Acknowledge
            </button>
          </div>
        }
      >
        {notification ? (
          <>
            <p className="fs-12 text-muted">
              {notification.id.toUpperCase()} · Raised {notification.at} · {notification.source}
            </p>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
              <span className={`ntf-chip is-${notification.moduleKey}`}>{notification.module}</span>
              <span className={`ntf-pri is-${notification.priority}`}>
                {PRIORITY_LABEL[notification.priority]}
              </span>
              {notification.pinned ? <span className="ntf-chip is-plain">Pinned</span> : null}
            </div>

            <span className="ntf-lbl">Notification details</span>
            <p className="fs-13 text-muted mt-1">{notification.text}</p>
            {notification.preview ? (
              <p className="fs-13 text-muted">{notification.preview}</p>
            ) : null}

            {notification.attachments?.length ? (
              <>
                <span className="ntf-lbl">Attachments</span>
                <div className="d-flex flex-wrap gap-2 mt-1 mb-3">
                  {notification.attachments.map((file) => (
                    <span className="ntf-file" key={file.name}>
                      <i className="ti ti-paperclip me-1" />
                      {file.name}
                    </span>
                  ))}
                </div>
              </>
            ) : null}

            <span className="ntf-lbl">
              Activity timeline · step {DELIVERY.filter((step) => step.done).length} of{' '}
              {DELIVERY.length}
            </span>
            <div className="mt-2">
              {DELIVERY.map((step) => (
                <div className={`ntf-step${step.done ? ' is-done' : ''}`} key={step.title}>
                  <span className="ntf-step-ic">
                    <i className={step.done ? 'ti ti-check' : 'ti ti-clock'} />
                  </span>
                  <div>
                    <p className="ntf-step-title">
                      {step.title}
                      <span className="fs-12 text-muted ms-2">{step.at}</span>
                    </p>
                    <p className="fs-13 text-muted mb-0">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </Offcanvas>
    </>
  );
};

export default NotificationModals;
