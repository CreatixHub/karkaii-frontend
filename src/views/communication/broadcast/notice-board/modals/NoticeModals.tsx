import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import type { Category, Notice, NoticeFile, NoticeStatus, Priority } from '../data/notices.data';
import {
  branchOptions,
  categoryBadge,
  categoryIcon,
  categoryOptions,
  channelOptions,
  composerAudienceOptions,
  composerClassOptions,
  departmentOptions,
  priorityOptions,
  shareLinkOf,
  statusOptions,
  toSlashDate,
} from '../data/notices.data';

export type NoticeModalId =
  | 'create' | 'edit' | 'preview' | 'publish' | 'share' | 'attachment' | 'delete';

export interface NoticeDraft {
  title: string;
  category: Category;
  priority: Priority;
  publishDate: string;
  expiryDate: string;
  audience: string;
  classes: string;
  department: string;
  branch: string;
  description: string;
  status: NoticeStatus;
}

export const emptyDraft: NoticeDraft = {
  title: '', category: 'Emergency', priority: 'High',
  publishDate: '25/07/2026', expiryDate: '10/08/2026',
  audience: composerAudienceOptions[0], classes: composerClassOptions[0],
  department: departmentOptions[0], branch: branchOptions[0],
  description: '', status: 'Published',
};

export const draftOf = (row: Notice): NoticeDraft => ({
  title: row.title,
  category: row.category,
  priority: row.priority,
  publishDate: toSlashDate(row.published),
  expiryDate: toSlashDate(row.expiry),
  audience: composerAudienceOptions.find((option) => option === row.audience)
    ?? composerAudienceOptions[0],
  classes: composerClassOptions.find((option) => option === row.classes) ?? composerClassOptions[0],
  department: departmentOptions.find((option) => option === row.department) ?? departmentOptions[0],
  branch: branchOptions.find((option) => option === row.branch) ?? branchOptions[0],
  description: row.full,
  status: row.status,
});

export interface PublishPayload {
  audience: string;
  publishDate: string;
  channels: string;
  pin: boolean;
}

export interface SharePayload {
  shareWith: string;
  email: boolean;
  sms: boolean;
  app: boolean;
}

export interface NoticeModalsProps {
  active: NoticeModalId | null;
  row: Notice | null;
  /** The attachment the preview was opened on. */
  file: NoticeFile | null;
  onClose: () => void;
  onCreate: (draft: NoticeDraft) => void;
  onUpdate: (draft: NoticeDraft) => void;
  onPublish: (payload: PublishPayload) => void;
  onShare: (payload: SharePayload) => void;
  onDelete: () => void;
}

const NoticeModals = ({
  active, row, file, onClose, onCreate, onUpdate, onPublish, onShare, onDelete,
}: NoticeModalsProps) => {
  const [draft, setDraft] = useState<NoticeDraft>(emptyDraft);

  const [publishAudience, setPublishAudience] = useState(composerAudienceOptions[0]);
  const [publishDate, setPublishDate] = useState('25/07/2026');
  const [channels, setChannels] = useState(channelOptions[0]);
  const [pin, setPin] = useState(false);

  const [shareWith, setShareWith] = useState(composerAudienceOptions[0]);
  const [shareEmail, setShareEmail] = useState(true);
  const [shareSms, setShareSms] = useState(false);
  const [shareApp, setShareApp] = useState(true);

  useEffect(() => {
    if (active === 'create') setDraft(emptyDraft);
    if (!row) return;
    if (active === 'edit') setDraft(draftOf(row));
    if (active === 'publish') {
      setPublishAudience(
        composerAudienceOptions.find((option) => option === row.audience)
        ?? composerAudienceOptions[0],
      );
      setPublishDate(toSlashDate(row.published) || '25/07/2026');
      setPin(row.pinned);
    }
    if (active === 'share') {
      setShareWith(
        composerAudienceOptions.find((option) => option === row.audience)
        ?? composerAudienceOptions[0],
      );
    }
  }, [active, row]);

  const field = (key: keyof NoticeDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  return (
    <>
      {/* Create Notice */}
      <Modal
        open={active === 'create'}
        onClose={onClose}
        title="Create Notice"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Notice</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="nb-title">
              Notice Title <span className="text-danger">*</span>
            </label>
            <input
              type="text" className="form-control" id="nb-title"
              placeholder="e.g. Campus Closed — Regional Public Holiday"
              value={draft.title} onChange={(event) => field('title', event.target.value)}
            />
            {!draft.title.trim() ? (
              <span className="fs-12 text-muted">Enter a title.</span>
            ) : null}
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nb-category">Category</label>
            <select
              className="form-select" id="nb-category"
              value={draft.category} onChange={(event) => field('category', event.target.value)}
            >
              {categoryOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nb-priority">Priority</label>
            <select
              className="form-select" id="nb-priority"
              value={draft.priority} onChange={(event) => field('priority', event.target.value)}
            >
              {priorityOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nb-publish">Publish Date</label>
            <input
              type="text" className="form-control" id="nb-publish" placeholder="dd/mm/yyyy"
              value={draft.publishDate} onChange={(event) => field('publishDate', event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nb-expiry">Expiry Date</label>
            <input
              type="text" className="form-control" id="nb-expiry" placeholder="dd/mm/yyyy"
              value={draft.expiryDate} onChange={(event) => field('expiryDate', event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nb-audience">Audience</label>
            <select
              className="form-select" id="nb-audience"
              value={draft.audience} onChange={(event) => field('audience', event.target.value)}
            >
              {composerAudienceOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nb-classes">Classes</label>
            <select
              className="form-select" id="nb-classes"
              value={draft.classes} onChange={(event) => field('classes', event.target.value)}
            >
              {composerClassOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nb-department">Department</label>
            <select
              className="form-select" id="nb-department"
              value={draft.department} onChange={(event) => field('department', event.target.value)}
            >
              {departmentOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nb-branch">Branch</label>
            <select
              className="form-select" id="nb-branch"
              value={draft.branch} onChange={(event) => field('branch', event.target.value)}
            >
              {branchOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="nb-description">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control" rows={4} id="nb-description"
              placeholder="Write the notice content…"
              value={draft.description} onChange={(event) => field('description', event.target.value)}
            />
            {!draft.description.trim() ? (
              <span className="fs-12 text-muted">Enter the notice content.</span>
            ) : null}
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="nb-attachments">Attachments</label>
            <input type="file" className="form-control" id="nb-attachments" />
          </div>
        </div>
      </Modal>

      {/* Edit Notice */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Notice"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">{row.id} · published {row.published}</p>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label" htmlFor="nb-e-title">Notice Title</label>
                <input
                  type="text" className="form-control" id="nb-e-title"
                  value={draft.title} onChange={(event) => field('title', event.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="nb-e-category">Category</label>
                <select
                  className="form-select" id="nb-e-category"
                  value={draft.category} onChange={(event) => field('category', event.target.value)}
                >
                  {categoryOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="nb-e-priority">Priority</label>
                <select
                  className="form-select" id="nb-e-priority"
                  value={draft.priority} onChange={(event) => field('priority', event.target.value)}
                >
                  {priorityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="nb-e-expiry">Expiry Date</label>
                <input
                  type="text" className="form-control" id="nb-e-expiry"
                  value={draft.expiryDate} onChange={(event) => field('expiryDate', event.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="nb-e-status">Status</label>
                <select
                  className="form-select" id="nb-e-status"
                  value={draft.status} onChange={(event) => field('status', event.target.value)}
                >
                  {statusOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="nb-e-description">Description</label>
                <textarea
                  className="form-control" rows={4} id="nb-e-description"
                  value={draft.description}
                  onChange={(event) => field('description', event.target.value)}
                />
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Notice Preview */}
      <Modal
        open={active === 'preview' && row !== null}
        onClose={onClose}
        title="Notice Preview"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-outline-light bg-white me-2" onClick={onClose}>
              <i className="ti ti-file-type-pdf me-1" />Download
            </button>
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              <i className="ti ti-printer me-1" />Print
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-2 border-bottom pb-3 mb-3">
              <span className="avatar avatar-md bg-primary-transparent text-primary rounded flex-shrink-0">
                <i className="ti ti-school fs-20" />
              </span>
              <div>
                <h6 className="fs-14 mb-0">PreSkool</h6>
                <span className="fs-12 text-muted">Official Announcement</span>
              </div>
            </div>
            <span className={`${categoryBadge[row.category]} d-inline-flex align-items-center mb-2`}>
              <i className={`${categoryIcon[row.category]} me-1`} />{row.category}
            </span>
            <h5 className="fs-16 mb-2">{row.title}</h5>
            <p className="fs-13 text-muted mb-3">{row.full}</p>
            <div className="d-flex align-items-center flex-wrap gap-3">
              <span className="fs-12 text-muted">
                <i className="ti ti-calendar-up me-1" />Published {row.published}
              </span>
              <span className="fs-12 text-muted">
                <i className="ti ti-calendar-off me-1" />Expires {row.expiry}
              </span>
              <span className="fs-12 text-muted">
                <i className="ti ti-users me-1" />{row.audience}
              </span>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Publish & Notify */}
      <Modal
        open={active === 'publish' && row !== null}
        onClose={onClose}
        title="Publish & Notify"
        onSubmit={(event) => {
          event.preventDefault();
          onPublish({ audience: publishAudience, publishDate, channels, pin });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-send me-1" />Publish Notice
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-13 mb-3">
              <i className="ti ti-send me-2 text-primary" />
              Notify the selected audience when this notice is published.
            </p>
            <div className="border rounded p-2 mb-3">
              <h6 className="fs-13 mb-0">{row.title}</h6>
              <span className="fs-12 text-muted">{row.id} · {row.category}</span>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="nb-p-audience">Audience</label>
                <select
                  className="form-select" id="nb-p-audience"
                  value={publishAudience} onChange={(event) => setPublishAudience(event.target.value)}
                >
                  {composerAudienceOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="nb-p-date">Publish Date</label>
                <input
                  type="text" className="form-control" id="nb-p-date"
                  value={publishDate} onChange={(event) => setPublishDate(event.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="nb-p-channels">Channels</label>
                <select
                  className="form-select" id="nb-p-channels"
                  value={channels} onChange={(event) => setChannels(event.target.value)}
                >
                  {channelOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="col-12">
                <div className="form-check mb-0">
                  <input
                    className="form-check-input" type="checkbox" id="nb-p-pin"
                    checked={pin} onChange={(event) => setPin(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="nb-p-pin">
                    Pin this notice to the top of the board
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Share Notice */}
      <Modal
        open={active === 'share' && row !== null}
        onClose={onClose}
        title="Share Notice"
        onSubmit={(event) => {
          event.preventDefault();
          onShare({ shareWith, email: shareEmail, sms: shareSms, app: shareApp });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-share me-1" />Share
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="mb-3">
              <label className="form-label" htmlFor="nb-s-link">Share Link</label>
              <div className="input-group">
                {/* Built from the reference, so it always names this notice. */}
                <input
                  type="text" className="form-control" id="nb-s-link"
                  value={shareLinkOf(row)} readOnly
                />
                <button
                  type="button" className="btn btn-outline-light bg-white"
                  aria-label="Copy share link"
                  onClick={() => navigator.clipboard?.writeText(shareLinkOf(row))}
                >
                  <i className="ti ti-copy" />
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="nb-s-with">Share With</label>
              <select
                className="form-select" id="nb-s-with"
                value={shareWith} onChange={(event) => setShareWith(event.target.value)}
              >
                {composerAudienceOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
            <span className="form-label d-block">Channels</span>
            <div className="d-flex flex-wrap gap-3">
              {[
                { id: 'nb-s-email', label: 'Email', value: shareEmail, set: setShareEmail },
                { id: 'nb-s-sms', label: 'SMS', value: shareSms, set: setShareSms },
                { id: 'nb-s-app', label: 'App Push', value: shareApp, set: setShareApp },
              ].map((channel) => (
                <div className="form-check" key={channel.id}>
                  <input
                    className="form-check-input" type="checkbox" id={channel.id}
                    checked={channel.value} onChange={(event) => channel.set(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor={channel.id}>{channel.label}</label>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </Modal>

      {/* Attachment Preview */}
      <Modal
        open={active === 'attachment' && file !== null}
        onClose={onClose}
        title="Attachment Preview"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-outline-light bg-white me-2" onClick={() => window.print()}>
              <i className="ti ti-printer me-1" />Print
            </button>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              <i className="ti ti-download me-1" />Download
            </button>
          </>
        }
      >
        {file ? (
          <>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span className="avatar avatar-md bg-danger-transparent text-danger rounded flex-shrink-0">
                <i className={file.icon} />
              </span>
              <div className="overflow-hidden">
                <h6 className="fs-14 mb-0 text-truncate">{file.name}</h6>
                <span className="fs-12 text-muted">{file.meta}</span>
              </div>
            </div>
            <div className="border rounded text-center text-muted py-5">
              <i className={`${file.icon} fs-1 d-block mb-2`} />
              Document preview
            </div>
          </>
        ) : null}
      </Modal>

      {/* Confirm Deletion */}
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
            <h5 className="mb-2">Confirm Deletion</h5>
            {/* The template's copy is generic; this names the notice. */}
            <p className="text-muted mb-0">
              You are about to delete {row.id} — {row.title}. This cannot be undone once you delete.
            </p>
          </div>
        ) : null}
      </Modal>
    </>
  );
};

export default NoticeModals;
