import { useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import CommonSelect from '@core/common/commonSelect';
import type { DocumentModalId } from '../data/documents.data';

const SHARE_WITH = ['Parent', 'Class Teacher', 'Principal', 'Admin'];
const PERMISSIONS = ['Can view', 'Can download', 'Can edit'];
const VERIFICATION = ['Verified', 'Pending', 'Rejected'];
const MOVE_CATEGORIES = [
  'Admission Documents',
  'Birth Certificate',
  'Transfer Certificate',
  'Mark Sheets',
  'Identity Proof',
  'Medical Records',
  'Other Documents',
];
const UPLOAD_STUDENTS = ['Janet Daniel', 'George Kettut', 'Sophia Reyes'];
const UPLOAD_CATEGORIES = ['Birth Certificate', 'Aadhar', 'Marksheet', 'Medical Certificate'];

const BULK_FILES = [
  { id: 'b1', icon: 'ti ti-file-type-pdf', color: 'text-danger', name: 'doc-1.pdf', student: 'Janet Daniel', category: 'Birth Certificate' },
  { id: 'b2', icon: 'ti ti-file-type-jpg', color: 'text-info', name: 'doc-2.jpg', student: 'George Kettut', category: 'Aadhar' },
];

const VERSIONS = [
  { id: 'v3', label: 'v3', current: true, meta: 'Teena Mathew · 02 Jul 2026' },
  { id: 'v2', label: 'v2', current: false, meta: 'Parent · 15 May 2026' },
  { id: 'v1', label: 'v1', current: false, meta: 'Parent · 02 Jan 2026' },
];

const MANAGE_CATEGORIES = ['Birth Certificate', 'Aadhar', 'Marksheet'];

const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

const Dropzone = ({
  id,
  icon,
  title,
  hint,
  size = 'p-4',
  multiple = false,
  onPick,
}: {
  id: string;
  icon: string;
  title: string;
  hint: string;
  size?: string;
  multiple?: boolean;
  onPick?: () => void;
}) => (
  <>
    <label
      htmlFor={id}
      className={`dropzone-area d-flex flex-column align-items-center justify-content-center text-center border border-dashed rounded ${size}`}
    >
      <i className={`${icon} text-primary mb-2`} />
      <span className="fw-medium">{title}</span>
      <small className="text-muted">{hint}</small>
    </label>
    <input
      type="file"
      id={id}
      className="d-none"
      multiple={multiple}
      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      onChange={onPick}
    />
  </>
);

export interface DocumentModalsProps {
  active: DocumentModalId | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onConfirmDelete: () => void;
}

const DocumentModals = ({ active, onClose, onToast, onConfirmDelete }: DocumentModalsProps) => {
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  /** Mirrors the template's simulated upload progress. */
  const startUpload = () => {
    setUploaded(false);
    setProgress(0);
    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          window.clearInterval(timer);
          setUploaded(true);
          return 100;
        }
        return current + 10;
      });
    }, 120);
  };

  const cancel = (
    <button type="button" className="btn btn-light me-2" onClick={onClose}>
      Cancel
    </button>
  );

  const submit = (label: string, variant = 'btn-primary') => (
    <button type="submit" className={`btn ${variant}`}>
      {label}
    </button>
  );

  const settle = (message: string) => (event: React.FormEvent) => {
    event.preventDefault();
    onToast(message);
    onClose();
  };

  return (
    <>
      {/* Replace File */}
      <Modal
        open={active === 'replace'}
        onClose={onClose}
        title="Replace File"
        onSubmit={settle('File replaced successfully')}
        footer={
          <>
            {cancel}
            {submit('Replace')}
          </>
        }
      >
        <div className="alert alert-info d-flex align-items-center" role="alert">
          <i className="ti ti-info-circle me-2" />
          <span>The current file will be kept in version history.</span>
        </div>
        <Dropzone
          id="replace_file_input"
          icon="ti ti-replace fs-24"
          title="Drag & drop the new file, or click to browse"
          hint="PDF, JPG, PNG, DOC · max 10 MB"
        />
      </Modal>

      {/* Share Document */}
      <Modal
        open={active === 'share'}
        onClose={onClose}
        title="Share Document"
        onSubmit={settle('Document shared successfully')}
        footer={
          <>
            {cancel}
            {submit('Share')}
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="share-with">
            Share with
          </label>
          <CommonSelect inputId="share-with" options={toOptions(SHARE_WITH)} defaultValue={{ value: SHARE_WITH[0], label: SHARE_WITH[0] }} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="permission">
            Permission
          </label>
          <CommonSelect inputId="permission" options={toOptions(PERMISSIONS)} defaultValue={{ value: PERMISSIONS[0], label: PERMISSIONS[0] }} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="share-link">
            Share Link
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              defaultValue="https://karkaii.app/d/AD283778"
              readOnly
              id="share-link"
            />
            <button
              className="btn btn-outline-light bg-white"
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText('https://karkaii.app/d/AD283778');
                onToast('Link copied to clipboard');
              }}
            >
              <i className="ti ti-copy" />
            </button>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0 fs-15">Link expiry</h5>
            <p className="fs-12 mb-0">Disable link after 7 days</p>
          </div>
          <div className="status-toggle modal-status">
            <input type="checkbox" id="doc_share_expiry" className="check" defaultChecked />
            <label htmlFor="doc_share_expiry" className="checktoggle">
              {' '}
            </label>
          </div>
        </div>
      </Modal>

      {/* Verify Document */}
      <Modal
        open={active === 'verify'}
        onClose={onClose}
        title="Verify Document"
        onSubmit={settle('Verification saved')}
        footer={
          <>
            {cancel}
            {submit('Save')}
          </>
        }
      >
        <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
          <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2">
            <i className="ti ti-file-type-pdf fs-20" />
          </span>
          <div>
            <p className="mb-0 fw-medium text-dark">birth-certificate.pdf</p>
            <span className="fs-12 text-muted">Janet Daniel · AD283778</span>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="verification-status">
            Verification Status
          </label>
          <CommonSelect inputId="verification-status" options={toOptions(VERIFICATION)} defaultValue={{ value: VERIFICATION[0], label: VERIFICATION[0] }} />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="remarks">
            Remarks
          </label>
          <textarea rows={3} className="form-control" placeholder="Add verification remarks" id="remarks" />
        </div>
      </Modal>

      {/* Rename File */}
      <Modal
        open={active === 'rename'}
        onClose={onClose}
        title="Rename File"
        onSubmit={settle('File renamed')}
        footer={
          <>
            {cancel}
            {submit('Rename')}
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="file-name">
            File Name <span className="text-danger">*</span>
          </label>
          <input type="text" className="form-control" defaultValue="birth-certificate.pdf" id="file-name" />
        </div>
      </Modal>

      {/* Move File */}
      <Modal
        open={active === 'move'}
        onClose={onClose}
        title="Move File"
        onSubmit={settle('File moved')}
        footer={
          <>
            {cancel}
            {submit('Move')}
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="move-to-category">
            Move to Category
          </label>
          <CommonSelect inputId="move-to-category" options={toOptions(MOVE_CATEGORIES)} defaultValue={{ value: MOVE_CATEGORIES[0], label: MOVE_CATEGORIES[0] }} />
        </div>
      </Modal>

      {/* Upload Document */}
      <Modal
        open={active === 'upload'}
        onClose={onClose}
        title="Upload Document"
        dialogClassName="modal-lg"
        onSubmit={settle('Document uploaded successfully')}
        footer={
          <>
            {cancel}
            {submit('Upload')}
          </>
        }
      >
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="student-2">
                Student <span className="text-danger">*</span>
              </label>
              <CommonSelect inputId="student-2" options={toOptions(UPLOAD_STUDENTS)} defaultValue={{ value: UPLOAD_STUDENTS[0], label: UPLOAD_STUDENTS[0] }} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="category-2">
                Category <span className="text-danger">*</span>
              </label>
              <CommonSelect inputId="category-2" options={toOptions(UPLOAD_CATEGORIES)} defaultValue={{ value: UPLOAD_CATEGORIES[0], label: UPLOAD_CATEGORIES[0] }} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="document-name">
                Document Name <span className="text-danger">*</span>
              </label>
              <input type="text" className="form-control" id="document-name" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="expiry-date">
                Expiry Date
              </label>
              <div className="date-pic">
                <DateField
                  placeholder="Select"
                  id="expiry-date"
                />
                <span className="cal-icon">
                  <i className="ti ti-calendar" />
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="tags">
                Tags
              </label>
              <input type="text" className="form-control" placeholder="Comma separated" id="tags" />
            </div>
          </div>
          <div className="col-md-12">
            <label className="form-label">
              File <span className="text-danger">*</span>
            </label>
            <Dropzone
              id="doc_file"
              icon="ti ti-cloud-upload fs-24"
              title="Drag & drop a file here, or click to browse"
              hint="PDF, JPG, PNG, DOC · max 10 MB"
              onPick={startUpload}
            />
            {progress > 0 ? (
              <div className="upload-progress mt-3">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fs-13 text-dark">
                    <i className="ti ti-file me-1" />
                    Uploading file...
                  </span>
                </div>
                <div
                  className="progress"
                  role="progressbar"
                  aria-label="Upload progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                >
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    style={{ width: `${progress}%` }}
                  >
                    {progress}%
                  </div>
                </div>
                {uploaded ? (
                  <div className="upload-done alert alert-success d-flex align-items-center mt-2 mb-0">
                    <i className="ti ti-circle-check me-2" />
                    Upload complete and ready to save.
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </Modal>

      {/* Bulk Upload */}
      <Modal
        open={active === 'bulkUpload'}
        onClose={onClose}
        title="Bulk Upload"
        dialogClassName="modal-lg"
        onSubmit={settle('All files uploaded')}
        footer={
          <>
            {cancel}
            {submit('Upload All')}
          </>
        }
      >
        <div className="mb-3">
          <Dropzone
            id="bulk_files"
            icon="ti ti-cloud-upload fs-32"
            title="Drag & drop multiple files here, or click to browse"
            hint="You can assign student & category per file below."
            size="p-5"
            multiple
          />
        </div>
        <div className="list-group">
          {BULK_FILES.map((file) => (
            <div className="list-group-item d-flex align-items-center gap-2 flex-wrap" key={file.id}>
              <span className="text-dark flex-fill">
                <i className={`${file.icon} ${file.color} me-1`} />
                {file.name}
              </span>
              <select className="form-select w-auto" aria-label={file.student}>
                <option>{file.student}</option>
              </select>
              <select className="form-select w-auto" aria-label={file.category}>
                <option>{file.category}</option>
              </select>
              <button type="button" className="text-danger btn btn-link p-0 border-0" aria-label="Remove">
                <i className="ti ti-x" />
              </button>
            </div>
          ))}
        </div>
      </Modal>

      {/* Reject Document */}
      <Modal
        open={active === 'reject'}
        onClose={onClose}
        title="Reject Document"
        onSubmit={settle('Document rejected')}
        footer={
          <>
            {cancel}
            {submit('Reject', 'btn-danger')}
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="reason">
            Reason <span className="text-danger">*</span>
          </label>
          <textarea rows={4} className="form-control" placeholder="Enter reason" id="reason" />
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0 fs-15">Notify Uploader</h5>
            <p className="fs-12 mb-0">Send rejection notice</p>
          </div>
          <div className="status-toggle modal-status">
            <input type="checkbox" id="doc_reject_notify" className="check" defaultChecked />
            <label htmlFor="doc_reject_notify" className="checktoggle">
              {' '}
            </label>
          </div>
        </div>
      </Modal>

      {/* Version History */}
      <Modal
        open={active === 'version'}
        onClose={onClose}
        title="Version History"
        dialogClassName="modal-lg"
        footer={
          <button type="button" className="btn btn-light" onClick={onClose}>
            Close
          </button>
        }
      >
        <div className="list-group">
          {VERSIONS.map((version) => (
            <div
              className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2"
              key={version.id}
            >
              <div>
                <span className="fw-medium text-dark">
                  {version.label}
                  {version.current ? (
                    <span className="badge badge-soft-success ms-1">Current</span>
                  ) : null}
                </span>
                <div className="fs-12 text-muted">{version.meta}</div>
              </div>
              {version.current ? (
                <button type="button" className="btn btn-icon btn-sm btn-outline-light bg-white" aria-label="Download">
                  <i className="ti ti-download" />
                </button>
              ) : (
                <div className="d-flex gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-light"
                    onClick={() => onToast(`Restored ${version.label}`)}
                  >
                    Restore
                  </button>
                  <button type="button" className="btn btn-icon btn-sm btn-outline-light bg-white" aria-label="Download">
                    <i className="ti ti-download" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {/* Manage Categories */}
      <Modal
        open={active === 'categories'}
        onClose={onClose}
        title="Manage Categories"
        footer={
          <button type="button" className="btn btn-light" onClick={onClose}>
            Close
          </button>
        }
      >
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="New category name"
            aria-label="New category name"
          />
          <button className="btn btn-primary" type="button" onClick={() => onToast('Category added')}>
            <i className="ti ti-plus" />
          </button>
        </div>
        <ul className="list-group">
          {MANAGE_CATEGORIES.map((name) => (
            <li className="list-group-item d-flex align-items-center justify-content-between" key={name}>
              {name}{' '}
              <button type="button" className="text-danger btn btn-link p-0 border-0" aria-label={`Delete ${name}`}>
                <i className="ti ti-trash" />
              </button>
            </li>
          ))}
        </ul>
      </Modal>

      {/* Delete */}
      <Modal
        open={active === 'delete'}
        onClose={onClose}
        title="Confirm Deletion"
        hideHeader
        bodyClassName="text-center"
        onSubmit={(event) => {
          event.preventDefault();
          onConfirmDelete();
        }}
      >
        <>
          <span className="delete-icon">
            <i className="ti ti-trash-x" />
          </span>
          <h4>Confirm Deletion</h4>
          <p>You want to delete all the marked items, this cant be undone once you delete.</p>
          <div className="d-flex justify-content-center">
            <button type="button" className="btn btn-light me-3" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger">
              Yes, Delete
            </button>
          </div>
        </>
      </Modal>
    </>
  );
};

export default DocumentModals;
