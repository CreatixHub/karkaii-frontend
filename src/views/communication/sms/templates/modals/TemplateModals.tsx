import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Modal from '@components/ui/Modal';
import type { Category, Encoding, Route, SmsTemplate } from '../data/templates.data';
import {
  RATE_PER_SEGMENT,
  categoryOptions,
  encodingOptions,
  expandOf,
  fieldsOf,
  money,
  routeOptions,
  segmentSize,
  segmentsOf,
  senderOptions,
  statusBadge,
  statusOf,
} from '../data/templates.data';

export type TemplateModalId = 'create' | 'edit' | 'preview' | 'submit' | 'duplicate' | 'delete';

export interface TemplateDraft {
  name: string;
  category: Category;
  body: string;
  route: Route;
  encoding: Encoding;
  senderId: string;
  shared: boolean;
}

export const emptyDraft: TemplateDraft = {
  name: '', category: 'Fees', body: '', route: 'Transactional',
  encoding: 'GSM-7', senderId: senderOptions[0], shared: true,
};

export const draftOf = (row: SmsTemplate): TemplateDraft => ({
  name: row.name,
  category: row.category,
  body: row.body,
  route: row.route,
  encoding: row.encoding,
  senderId: row.senderId,
  shared: row.shared,
});

export interface SubmitPayload {
  note: string;
  notify: boolean;
}

export interface DuplicatePayload {
  name: string;
  copyRoute: boolean;
  submitNow: boolean;
}

export interface TemplateModalsProps {
  active: TemplateModalId | null;
  row: SmsTemplate | null;
  onClose: () => void;
  onCreate: (draft: TemplateDraft) => void;
  onUpdate: (draft: TemplateDraft) => void;
  onSubmitForApproval: (payload: SubmitPayload) => void;
  onDuplicate: (payload: DuplicatePayload) => void;
  onDelete: () => void;
}

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const TemplateModals = ({
  active, row, onClose, onCreate, onUpdate, onSubmitForApproval, onDuplicate, onDelete,
}: TemplateModalsProps) => {
  const [draft, setDraft] = useState<TemplateDraft>(emptyDraft);
  const [note, setNote] = useState('');
  const [notify, setNotify] = useState(true);
  const [copyName, setCopyName] = useState('');
  const [copyRoute, setCopyRoute] = useState(true);
  const [submitNow, setSubmitNow] = useState(false);

  useEffect(() => {
    if (active === 'create') setDraft(emptyDraft);
    if (!row) return;
    if (active === 'edit') setDraft(draftOf(row));
    if (active === 'submit') { setNote(''); setNotify(true); }
    if (active === 'duplicate') {
      setCopyName(`${row.name} (copy)`);
      setCopyRoute(true);
      setSubmitNow(false);
    }
  }, [active, row]);

  const field = (key: keyof TemplateDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  /* The composer's own counts, at the longest merge expansion. */
  const expanded = expandOf(draft.body);
  const segments = segmentsOf(expanded.length, draft.encoding);
  const remaining = segments * segmentSize(draft.encoding) - expanded.length;

  const form = (suffix: string) => (
    <div className="row g-3">
      <div className="col-md-7">
        <label className="form-label" htmlFor={`tpl-name${suffix}`}>Template name</label>
        <input
          type="text" className="form-control" id={`tpl-name${suffix}`}
          placeholder="e.g. Fee Reminder"
          value={draft.name} onChange={(event) => field('name', event.target.value)}
        />
      </div>
      <div className="col-md-5">
        <label className="form-label" htmlFor={`tpl-cat${suffix}`}>Category</label>
        <select
          className="form-select" id={`tpl-cat${suffix}`}
          value={draft.category} onChange={(event) => field('category', event.target.value)}
        >
          {categoryOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
      <div className="col-12">
        <label className="form-label" htmlFor={`tpl-body${suffix}`}>Template body</label>
        <textarea
          className="form-control" id={`tpl-body${suffix}`} rows={4}
          placeholder="Use {{student_name}}, {{fee_amount}} and the other merge fields for anything that differs per recipient."
          value={draft.body} onChange={(event) => field('body', event.target.value)}
        />
        {/* Counted as the gateway counts it, before it is saved. */}
        <span className="fs-12 text-muted">
          {expanded.length} characters · {segments} segment{segments === 1 ? '' : 's'} ·{' '}
          {remaining} left in segment {segments} · {money(segments * RATE_PER_SEGMENT)} per recipient
        </span>
      </div>
      <div className="col-md-4">
        <label className="form-label" htmlFor={`tpl-route${suffix}`}>Route type</label>
        <select
          className="form-select" id={`tpl-route${suffix}`}
          value={draft.route} onChange={(event) => field('route', event.target.value)}
        >
          {routeOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
        <span className="fs-12 text-muted">Transactional bypasses DND</span>
      </div>
      <div className="col-md-4">
        <label className="form-label" htmlFor={`tpl-sender${suffix}`}>Sender ID</label>
        <select
          className="form-select" id={`tpl-sender${suffix}`}
          value={draft.senderId} onChange={(event) => field('senderId', event.target.value)}
        >
          {senderOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
      <div className="col-md-4">
        <label className="form-label" htmlFor={`tpl-enc${suffix}`}>Encoding</label>
        <select
          className="form-select" id={`tpl-enc${suffix}`}
          value={draft.encoding} onChange={(event) => field('encoding', event.target.value)}
        >
          {encodingOptions.map((option) => (
            <option key={option} value={option}>
              {option} — {segmentSize(option)} per segment
            </option>
          ))}
        </select>
      </div>
      <div className="col-12">
        <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-0">
          <div>
            <h6 className="fs-13 mb-0">Available to all staff</h6>
            <span className="fs-12 text-muted">Otherwise administrators only</span>
          </div>
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`tpl-sh${suffix}`}
              checked={draft.shared} onChange={(event) => field('shared', event.target.checked)}
            />
            <label className="form-check-label visually-hidden" htmlFor={`tpl-sh${suffix}`}>
              Available to all staff
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Create template */}
      <Modal
        open={active === 'create'}
        onClose={onClose}
        title="Create SMS template"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save as draft</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          A new template is unusable until the operator registers it. Save it here, then submit it
          for approval.
        </p>
        {form('')}
      </Modal>

      {/* Edit template */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit SMS template"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save changes</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">{row.id} · {statusOf(row).toLowerCase()}</p>
            {statusOf(row) === 'Approved' ? (
              <div className="alert alert-warning d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-alert-triangle fs-16" />
                <span className="fs-13">
                  Editing a registered template withdraws its approval. It goes back to the operator
                  and cannot be sent from until it is registered again.
                </span>
              </div>
            ) : null}
            {form('-2')}
          </>
        ) : null}
      </Modal>

      {/* Preview */}
      <Modal
        open={active === 'preview' && row !== null}
        onClose={onClose}
        title="Preview template"
        footer={<button type="button" className="btn btn-light" onClick={onClose}>Close</button>}
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-2 mb-3">
              <h6 className="fs-14 mb-0 flex-fill">{row.name}</h6>
              <span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>
            </div>
            <p className="fs-12 text-muted mb-1">As stored, with merge fields</p>
            <div className="border rounded p-2 mb-3"><p className="fs-13 mb-0">{row.body}</p></div>
            <p className="fs-12 text-muted mb-1">As one parent receives it</p>
            <div className="border rounded p-3 mb-3">
              <span className="fs-12 text-muted d-block mb-2">{row.senderId} SMS · today</span>
              {/* The body resolved at the longest values on record. */}
              <p className="fs-13 mb-0">{expandOf(row.body)}</p>
            </div>
            <div className="border rounded p-3">
              <Row label="Characters" value={expandOf(row.body).length} />
              <Row
                label="Segments"
                value={segmentsOf(expandOf(row.body).length, row.encoding)}
              />
              <Row label="Merge fields" value={fieldsOf(row).join(', ') || 'None'} />
              <Row
                label="Cost per recipient"
                value={money(segmentsOf(expandOf(row.body).length, row.encoding) * RATE_PER_SEGMENT)}
              />
            </div>
          </>
        ) : null}
      </Modal>

      {/* Submit for registration */}
      <Modal
        open={active === 'submit' && row !== null}
        onClose={onClose}
        title="Submit for registration"
        onSubmit={(event) => { event.preventDefault(); onSubmitForApproval({ note, notify }); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Submit to operator</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              The operator registers the wording and the sender ID together. An unapproved edit is
              rejected at the gateway rather than delivered.
            </p>
            <div className="border rounded p-3 mb-3">
              <Row label="Template" value={row.name} />
              <Row label="Route" value={row.route} />
              <Row label="Sender ID" value={row.senderId} />
              <Row
                label="Segments"
                value={segmentsOf(expandOf(row.body).length, row.encoding)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="tpl-note">Note to the operator</label>
              <textarea
                className="form-control" id="tpl-note" rows={2}
                placeholder="Why this wording, if it differs from a registered template."
                value={note} onChange={(event) => setNote(event.target.value)}
              />
            </div>
            <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-0">
              <div>
                <h6 className="fs-13 mb-0">Notify me when it is registered</h6>
                <span className="fs-12 text-muted">Usually two working days</span>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input" type="checkbox" role="switch" id="tpl-notify"
                  checked={notify} onChange={(event) => setNotify(event.target.checked)}
                />
                <label className="form-check-label visually-hidden" htmlFor="tpl-notify">
                  Notify me when it is registered
                </label>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Duplicate */}
      <Modal
        open={active === 'duplicate' && row !== null}
        onClose={onClose}
        title="Duplicate template"
        onSubmit={(event) => {
          event.preventDefault();
          onDuplicate({ name: copyName, copyRoute, submitNow });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Duplicate</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              The copy is a draft. A registration does not carry over — the operator registers each
              wording separately.
            </p>
            <div className="mb-3">
              <label className="form-label" htmlFor="tpl-copy-name">New name</label>
              <input
                type="text" className="form-control" id="tpl-copy-name"
                value={copyName} onChange={(event) => setCopyName(event.target.value)}
              />
            </div>
            {[
              { id: 'tpl-copy-route', title: 'Copy route and sender ID', note: `${row.route} · ${row.senderId}`, value: copyRoute, set: setCopyRoute },
              { id: 'tpl-copy-submit', title: 'Submit for registration now', note: 'Otherwise it stays a draft', value: submitNow, set: setSubmitNow },
            ].map((toggle, index, all) => (
              <div
                className={`d-flex align-items-center justify-content-between border rounded p-2 ${index === all.length - 1 ? 'mb-0' : 'mb-2'}`}
                key={toggle.id}
              >
                <div>
                  <h6 className="fs-13 mb-0">{toggle.title}</h6>
                  <span className="fs-12 text-muted">{toggle.note}</span>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id={toggle.id}
                    checked={toggle.value} onChange={(event) => toggle.set(event.target.checked)}
                  />
                  <label className="form-check-label visually-hidden" htmlFor={toggle.id}>
                    {toggle.title}
                  </label>
                </div>
              </div>
            ))}
          </>
        ) : null}
      </Modal>

      {/* Delete */}
      <Modal
        open={active === 'delete' && row !== null}
        onClose={onClose}
        title=""
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={onDelete}>Yes, Delete</button>
          </>
        }
      >
        {row ? (
          <div className="text-center">
            <span className="avatar avatar-xl bg-danger-transparent text-danger rounded-circle mb-3">
              <i className="ti ti-trash-x fs-24" />
            </span>
            <h5 className="mb-2">Delete {row.name}?</h5>
            <p className="text-muted mb-0">
              {row.uses > 0
                ? `This template has been sent from ${row.uses} times. Deleting it does not affect messages already delivered.`
                : 'This template has never been sent from.'}
            </p>
          </div>
        ) : null}
      </Modal>
    </>
  );
};

export default TemplateModals;
