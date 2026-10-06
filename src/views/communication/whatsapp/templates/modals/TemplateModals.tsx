import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Modal from '@components/ui/Modal';
import type { ButtonKind, Category, WhatsappTemplate } from '../data/templates.data';
import {
  buttonOptions,
  categoryBadge,
  categoryOptions,
  isUsable,
  languageOptions,
  qualityBadge,
  stateBadge,
  stateOf,
  variablesOf,
} from '../data/templates.data';

export type TemplateModalId = 'create' | 'edit' | 'preview' | 'submit' | 'duplicate' | 'delete';

export interface TemplateDraft {
  name: string;
  label: string;
  category: Category;
  languages: string[];
  header: string;
  body: string;
  footer: string;
  button: ButtonKind;
}

export const emptyDraft: TemplateDraft = {
  name: '', label: '', category: 'Utility', languages: ['English'],
  header: '', body: '', footer: 'Karkaii', button: 'None',
};

export const draftOf = (row: WhatsappTemplate): TemplateDraft => ({
  name: row.name,
  label: row.label,
  category: row.category,
  languages: row.languages,
  header: row.header,
  body: row.body,
  footer: row.footer,
  button: row.button,
});

export interface SubmitPayload {
  note: string;
  notify: boolean;
}

export interface DuplicatePayload {
  name: string;
  label: string;
  submitNow: boolean;
}

export interface TemplateModalsProps {
  active: TemplateModalId | null;
  row: WhatsappTemplate | null;
  onClose: () => void;
  onCreate: (draft: TemplateDraft) => void;
  onUpdate: (draft: TemplateDraft) => void;
  onSubmitForReview: (payload: SubmitPayload) => void;
  onDuplicate: (payload: DuplicatePayload) => void;
  onDelete: () => void;
}

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

/** The body with its placeholders filled in, as a recipient reads it. */
const resolved = (body: string): string => {
  const values = ['Aarav Menon', 'Class 7-B', '10 Aug 2026'];
  return body.replace(/\{\{(\d+)\}\}/g, (_, index) => values[Number(index) - 1] ?? `value ${index}`);
};

const TemplateModals = ({
  active, row, onClose, onCreate, onUpdate, onSubmitForReview, onDuplicate, onDelete,
}: TemplateModalsProps) => {
  const [draft, setDraft] = useState<TemplateDraft>(emptyDraft);
  const [note, setNote] = useState('');
  const [notify, setNotify] = useState(true);
  const [copyName, setCopyName] = useState('');
  const [copyLabel, setCopyLabel] = useState('');
  const [submitNow, setSubmitNow] = useState(false);

  useEffect(() => {
    if (active === 'create') setDraft(emptyDraft);
    if (!row) return;
    if (active === 'edit') setDraft(draftOf(row));
    if (active === 'submit') { setNote(''); setNotify(true); }
    if (active === 'duplicate') {
      setCopyName(`${row.name}_copy`);
      setCopyLabel(`${row.label} (copy)`);
      setSubmitNow(false);
    }
  }, [active, row]);

  const field = (key: keyof TemplateDraft, value: string | string[]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const toggleLanguage = (language: string) =>
    setDraft((current) => ({
      ...current,
      languages: current.languages.includes(language)
        ? current.languages.filter((entry) => entry !== language)
        : [...current.languages, language],
    }));

  const placeholders = (draft.body.match(/\{\{\d+\}\}/g) ?? []).length;

  const form = (suffix: string) => (
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label" htmlFor={`wat-name${suffix}`}>Template name</label>
        <input
          type="text" className="form-control" id={`wat-name${suffix}`}
          placeholder="fee_reminder_term2"
          value={draft.name} onChange={(event) => field('name', event.target.value)}
        />
        <span className="fs-12 text-muted">Lower case and underscores, as Meta requires</span>
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor={`wat-label${suffix}`}>Display name</label>
        <input
          type="text" className="form-control" id={`wat-label${suffix}`}
          placeholder="Fee Reminder"
          value={draft.label} onChange={(event) => field('label', event.target.value)}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor={`wat-cat${suffix}`}>Category</label>
        <select
          className="form-select" id={`wat-cat${suffix}`}
          value={draft.category} onChange={(event) => field('category', event.target.value)}
        >
          {categoryOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
        {/* Meta refuses promotional wording filed as Utility. */}
        {draft.category === 'Utility' ? (
          <span className="fs-12 text-muted">
            Utility must be transactional — an offer belongs in Marketing
          </span>
        ) : null}
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor={`wat-btn${suffix}`}>Button</label>
        <select
          className="form-select" id={`wat-btn${suffix}`}
          value={draft.button} onChange={(event) => field('button', event.target.value)}
        >
          {buttonOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
      <div className="col-12">
        <span className="form-label d-block">Languages</span>
        <div className="d-flex flex-wrap gap-3">
          {languageOptions.map((language) => (
            <div className="form-check" key={language}>
              <input
                className="form-check-input" type="checkbox" id={`wat-lang-${language}${suffix}`}
                checked={draft.languages.includes(language)}
                onChange={() => toggleLanguage(language)}
              />
              <label className="form-check-label fs-13" htmlFor={`wat-lang-${language}${suffix}`}>
                {language}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="col-12">
        <label className="form-label" htmlFor={`wat-hdr${suffix}`}>
          Header <span className="text-muted fs-12">(optional)</span>
        </label>
        <input
          type="text" className="form-control" id={`wat-hdr${suffix}`}
          placeholder="Text shown above the body"
          value={draft.header} onChange={(event) => field('header', event.target.value)}
        />
      </div>
      <div className="col-12">
        <label className="form-label" htmlFor={`wat-body${suffix}`}>Body</label>
        <textarea
          className="form-control" id={`wat-body${suffix}`} rows={4}
          placeholder="Use {{1}}, {{2}} for variables."
          value={draft.body} onChange={(event) => field('body', event.target.value)}
        />
        {/* Counted from the placeholders in the body itself. */}
        <span className="fs-12 text-muted">
          {placeholders} variable{placeholders === 1 ? '' : 's'} · {draft.body.length} characters
        </span>
      </div>
      <div className="col-12">
        <label className="form-label" htmlFor={`wat-foot${suffix}`}>
          Footer <span className="text-muted fs-12">(optional)</span>
        </label>
        <input
          type="text" className="form-control" id={`wat-foot${suffix}`}
          value={draft.footer} onChange={(event) => field('footer', event.target.value)}
        />
      </div>
      {draft.body ? (
        <div className="col-12">
          <span className="form-label d-block">As a recipient reads it</span>
          <div className="border rounded p-3">
            {draft.header ? <h6 className="fs-13 mb-1">{draft.header}</h6> : null}
            <p className="fs-13 mb-1">{resolved(draft.body)}</p>
            {draft.footer ? <span className="fs-12 text-muted">{draft.footer}</span> : null}
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      {/* Create */}
      <Modal
        open={active === 'create'}
        onClose={onClose}
        title="Create WhatsApp template"
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
          A template is unusable until Meta approves it. Save it here, then submit it for review.
        </p>
        {form('')}
      </Modal>

      {/* Edit */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit WhatsApp template"
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
            <p className="fs-12 text-muted mb-3">{row.id} · {stateOf(row).toLowerCase()}</p>
            {isUsable(row) ? (
              <div className="alert alert-warning d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-alert-triangle fs-16" />
                <span className="fs-13">
                  Editing an approved template withdraws its approval. It goes back to Meta for
                  review and cannot be sent from until it clears.
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
            <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
              <h6 className="fs-14 mb-0 flex-fill">{row.label}</h6>
              <span className={categoryBadge[row.category]}>{row.category}</span>
              <span className={stateBadge[stateOf(row)]}>{stateOf(row)}</span>
              <span className={qualityBadge[row.quality]}>{row.quality}</span>
            </div>
            <p className="fs-12 text-muted mb-1">As registered, with placeholders</p>
            <div className="border rounded p-2 mb-3">
              {row.header ? <h6 className="fs-13 mb-1">{row.header}</h6> : null}
              <p className="fs-13 mb-1">{row.body}</p>
              {row.footer ? <span className="fs-12 text-muted">{row.footer}</span> : null}
            </div>
            <p className="fs-12 text-muted mb-1">As a recipient reads it</p>
            <div className="border rounded p-3 mb-3">
              {row.header ? <h6 className="fs-13 mb-1">{row.header}</h6> : null}
              <p className="fs-13 mb-1">{resolved(row.body)}</p>
              {row.footer ? <span className="fs-12 text-muted">{row.footer}</span> : null}
              {row.button !== 'None' ? (
                <div className="border-top mt-2 pt-2 text-center fs-13 text-primary">
                  {row.button}
                </div>
              ) : null}
            </div>
            <div className="border rounded p-3">
              <Row label="Variables" value={variablesOf(row)} />
              <Row label="Languages" value={row.languages.join(', ')} />
              <Row label="Header media" value={row.headerMedia || 'None'} />
              <Row label="Broadcasts" value={row.uses} />
            </div>
          </>
        ) : null}
      </Modal>

      {/* Submit for review */}
      <Modal
        open={active === 'submit' && row !== null}
        onClose={onClose}
        title="Submit for review"
        onSubmit={(event) => { event.preventDefault(); onSubmitForReview({ note, notify }); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Submit to Meta</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              Approval usually takes a few minutes but can take a day. Nothing can be sent from this
              template until it comes back.
            </p>
            <div className="border rounded p-3 mb-3">
              <Row label="Template" value={row.name} />
              <Row label="Category" value={row.category} />
              <Row label="Languages" value={row.languages.join(', ')} />
              <Row label="Variables" value={variablesOf(row)} />
              {row.rejectedReason ? (
                <Row label="Previously rejected" value={row.rejectedReason} />
              ) : null}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="wat-note">Note</label>
              <textarea
                className="form-control" id="wat-note" rows={2}
                placeholder="What changed since the last submission, if this is a resubmission."
                value={note} onChange={(event) => setNote(event.target.value)}
              />
            </div>
            <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-0">
              <div>
                <h6 className="fs-13 mb-0">Notify me when it is reviewed</h6>
                <span className="fs-12 text-muted">Approved or rejected, either way</span>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input" type="checkbox" role="switch" id="wat-notify"
                  checked={notify} onChange={(event) => setNotify(event.target.checked)}
                />
                <label className="form-check-label visually-hidden" htmlFor="wat-notify">
                  Notify me when it is reviewed
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
          onDuplicate({ name: copyName, label: copyLabel, submitNow });
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
              Meta registers each wording separately, so the copy starts as a draft with no
              approval of its own.
            </p>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="wat-copy-name">Template name</label>
                <input
                  type="text" className="form-control" id="wat-copy-name"
                  value={copyName} onChange={(event) => setCopyName(event.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="wat-copy-label">Display name</label>
                <input
                  type="text" className="form-control" id="wat-copy-label"
                  value={copyLabel} onChange={(event) => setCopyLabel(event.target.value)}
                />
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-0">
              <div>
                <h6 className="fs-13 mb-0">Submit for review now</h6>
                <span className="fs-12 text-muted">Otherwise it stays a draft</span>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input" type="checkbox" role="switch" id="wat-copy-submit"
                  checked={submitNow} onChange={(event) => setSubmitNow(event.target.checked)}
                />
                <label className="form-check-label visually-hidden" htmlFor="wat-copy-submit">
                  Submit for review now
                </label>
              </div>
            </div>
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
            <h5 className="mb-2">Delete {row.label}?</h5>
            <p className="text-muted mb-0">
              {row.uses > 0
                ? `This template has been broadcast from ${row.uses} times. Deleting it here also removes it from the business account.`
                : 'This template has never been broadcast from.'}
            </p>
          </div>
        ) : null}
      </Modal>
    </>
  );
};

export default TemplateModals;
