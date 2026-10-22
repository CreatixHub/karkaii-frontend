import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MultiSelect from '@components/ui/MultiSelect';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useForm } from '@hooks/useForm';
import type { ToastVariant } from '@hooks/useToasts';
import { email as emailRule, required } from '@utils/validation';
import type { ParentListModalId, ParentRow } from '../data/parentsList.data';

const routes = all_routes;

const CHILD_OPTIONS = ['Janet', 'Joann', 'Kathleen', 'Gifford'].map((name) => ({ value: name, label: name }));
const IMPORT_MODES = ['Create new parents', 'Update existing by parent ID', 'Create and update'];

const requiredEmail = required('Please enter a valid email address.');
const validEmail = emailRule('Please enter a valid email address.');

const fieldError = (message?: string, touched?: boolean) =>
  message && touched ? <div className="invalid-feedback d-block">{message}</div> : null;

export interface ParentListModalsProps {
  active: ParentListModalId | null;
  /** The row that opened the dialog; the bulk bar passes null. */
  parent: ParentRow | null;
  onClose: () => void;
  onToast: (message: string, variant?: ToastVariant) => void;
  onAdd: (name: string) => void;
  onSave: (id: string, name: string) => void;
  onConfirmDelete: () => void;
}

const ParentListModals = ({
  active,
  parent,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
}: ParentListModalsProps) => {
  const [importMode, setImportMode] = useState(IMPORT_MODES[0]);

  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addChildren, setAddChildren] = useState<string[]>([]);

  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editChildren, setEditChildren] = useState<string[]>([]);

  useEffect(() => {
    if (active === 'edit' && parent) {
      setEditName(parent.name);
      setEditPhone(parent.phone);
      setEditEmail(parent.email);
      setEditChildren([parent.child.name]);
    }
  }, [active, parent]);

  const closeAdd = () => {
    setAddName('');
    setAddPhone('');
    setAddEmail('');
    setAddChildren([]);
    onClose();
  };

  /* --------------------------------- Message -------------------------------- */
  const messageForm = useForm<{ subject: string; body: string }, string>({
    initialValues: { subject: '', body: '' },
    validationSchema: {
      subject: required('Please enter a subject.'),
      body: required('Please enter a message.'),
    },
    onSubmit: async () => 'Message sent to parent',
    onSuccess: (message) => {
      onToast(message);
      messageForm.reset();
      onClose();
    },
  });

  /* ---------------------------------- Email --------------------------------- */
  const emailForm = useForm<{ to: string; subject: string; body: string }, string>({
    initialValues: { to: '', subject: '', body: '' },
    validationSchema: {
      to: (value, values) => requiredEmail(value, values) ?? validEmail(value, values),
      subject: required('Please enter a subject.'),
      body: required('Please enter a message.'),
    },
    onSubmit: async () => 'Email sent successfully',
    onSuccess: (message) => {
      onToast(message);
      emailForm.reset();
      onClose();
    },
  });

  const recipientLine = parent ? `${parent.name} · ${parent.phone}` : '';

  return (
    <>
      {/* Import Parents */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Parents"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onToast('File queued — 11 rows validated.');
          onClose();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary form-submit">
              Import
            </button>
          </>
        }
      >
        <div className="stacked-dropdown mb-3">
          <i className="ti ti-cloud-upload" />
          <b>Drop your CSV or Excel file here</b>
          <span className="fs-12 text-muted">or click to browse · max 10 MB</span>
          <input type="file" aria-label="Parent list file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            {IMPORT_MODES.map((mode) => (
              <option key={mode}>{mode}</option>
            ))}
          </select>
        </div>
        <div className="alert alert-light border d-flex align-items-start gap-2 mb-0" role="note">
          <i className="ti ti-download fs-16" />
          <span className="fs-12">
            Not sure about the format? Download the template with all required columns and sample rows.
          </span>
        </div>
      </Modal>

      {/* Add Parent */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Parent"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(addName || 'New Parent');
          closeAdd();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={closeAdd}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Parent
            </button>
          </>
        }
      >
        <div className="d-flex align-items-center upload-pic flex-wrap row-gap-3 mb-3">
          <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
            <i className="ti ti-photo-plus fs-16" />
          </div>
          <div className="profile-upload">
            <div className="profile-uploader d-flex align-items-center">
              <div className="drag-upload-btn mb-3">
                Upload
                <input type="file" className="form-control image-sign" multiple aria-label="Upload" />
              </div>
              <button type="button" className="btn btn-primary mb-3">
                Remove
              </button>
            </div>
            <p>Upload image size 4MB, Format JPG, PNG, SVG</p>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input type="text" className="form-control" id="name" value={addName} onChange={(event) => setAddName(event.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="phone-number">
            Phone Number
          </label>
          <input
            type="text"
            className="form-control"
            id="phone-number"
            value={addPhone}
            onChange={(event) => setAddPhone(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="email-address">
            Email Address
          </label>
          <input
            type="text"
            className="form-control"
            id="email-address"
            value={addEmail}
            onChange={(event) => setAddEmail(event.target.value)}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="child">
            Child
          </label>
          <MultiSelect
            inputId="child"
            className="select select2"
            options={CHILD_OPTIONS}
            value={addChildren}
            onChange={setAddChildren}
          />
        </div>
      </Modal>

      {/* Edit Parent */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Parent"
        onSubmit={(event) => {
          event.preventDefault();
          if (parent) onSave(parent.id, editName);
          onClose();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <div className="d-flex align-items-center upload-pic flex-wrap row-gap-3 mb-3">
          <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
            {parent ? (
              <ImageWithBasePath src={parent.avatar} className="img-fluid rounded-circle" alt={parent.name} />
            ) : (
              <i className="ti ti-photo-plus fs-16" />
            )}
          </div>
          <div className="profile-upload">
            <div className="profile-uploader d-flex align-items-center">
              <div className="drag-upload-btn mb-3">
                Upload
                <input type="file" className="form-control image-sign" multiple aria-label="Upload" />
              </div>
              <button type="button" className="btn btn-primary mb-3">
                Remove
              </button>
            </div>
            <p>Upload image size 4MB, Format JPG, PNG, SVG</p>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="name-2">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Name"
            id="name-2"
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="phone-number-2">
            Phone Number
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Phone Number"
            id="phone-number-2"
            value={editPhone}
            onChange={(event) => setEditPhone(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="email-address-2">
            Email Address
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Email Address"
            id="email-address-2"
            value={editEmail}
            onChange={(event) => setEditEmail(event.target.value)}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="child-2">
            Child
          </label>
          <MultiSelect
            inputId="child-2"
            className="select select2"
            options={CHILD_OPTIONS}
            value={editChildren}
            onChange={setEditChildren}
          />
        </div>
      </Modal>

      {/* View Details */}
      <Modal open={active === 'view'} onClose={onClose} title="View Details" dialogClassName="modal-lg" bodyClassName="mb-0">
        {parent ? (
          <>
            <div className="parent-wrap">
              <div className="row align-items-center">
                <div className="col-12 col-lg-6">
                  <div className="d-flex align-items-center mb-3">
                    <span className="avatar avatar-xl me-2">
                      <ImageWithBasePath src={parent.avatar} alt={parent.name} />
                    </span>
                    <div className="parent-name">
                      <h5 className="mb-1">{parent.name}</h5>
                      <p>Added on {parent.addedOn}</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <ul className="d-flex align-items-center">
                    <li className="mb-3 me-5">
                      <p className="mb-1">Email</p>
                      <h6 className="fw-normal">{parent.email}</h6>
                    </li>
                    <li className="mb-3">
                      <p className="mb-1">Phone</p>
                      <h6 className="fw-normal">{parent.phone}</h6>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <h5 className="mb-3">Children Details</h5>
            {parent.children.map((child) => (
              <div className="border rounded p-4 pb-1 mb-3" key={child.admissionNo}>
                <div className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-3 border-bottom">
                  <span className="link-primary mb-2">{child.admissionNo}</span>
                  <span className="badge badge-soft-success badge-md mb-2">
                    <i className="ti ti-circle-filled me-2" />
                    Active
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap">
                  <div className="d-flex align-items-center mb-3">
                    <Link to={routes.studentDetail} className="avatar">
                      <ImageWithBasePath src={child.avatar} className="img-fluid rounded-circle flex-shrink-0" alt={child.name} />
                    </Link>
                    <div className="ms-2">
                      <p className="mb-0">
                        <Link to={routes.studentDetail}>{child.name}</Link>
                      </p>
                      <span>{child.classLabel}</span>
                    </div>
                  </div>
                  <ul className="d-flex align-items-center flex-wrap">
                    <li className="mb-3 me-4">
                      <p className="mb-1">Roll No</p>
                      <h6 className="fw-normal">{child.rollNo}</h6>
                    </li>
                    <li className="mb-3 me-4">
                      <p className="mb-1">Gender</p>
                      <h6 className="fw-normal">{child.gender}</h6>
                    </li>
                    <li className="mb-3">
                      <p className="mb-1">Date of Joined</p>
                      <h6 className="fw-normal">{child.dateOfJoined}</h6>
                    </li>
                  </ul>
                  <div className="d-flex align-items-center">
                    <button type="button" className="btn btn-light mb-3 me-3">
                      Add Fees
                    </button>
                    <Link to={routes.studentDetail} className="btn btn-primary mb-3">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : null}
      </Modal>

      {/* Delete confirmation */}
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
      </Modal>

      {/* Message Parent */}
      <Modal
        open={active === 'message'}
        onClose={onClose}
        title="Message Parent"
        titleIcon="ti ti-message"
        formClassName="workspace-validated-form"
        onSubmit={messageForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary workspace-submit">
              <i className="ti ti-send me-1" />
              Send Message
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="recipient">
            Recipient
          </label>
          <input type="text" className="form-control message-recipient" readOnly id="recipient" value={recipientLine} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="subject">
            Subject <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="subject"
            placeholder="Enter subject"
            id="subject"
            value={messageForm.values.subject}
            onChange={messageForm.handleChange}
            onBlur={messageForm.handleBlur}
          />
          {fieldError(messageForm.errors.subject, messageForm.touched.subject)}
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="message">
            Message <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            name="body"
            rows={4}
            placeholder="Type your message…"
            id="message"
            value={messageForm.values.body}
            onChange={messageForm.handleChange}
            onBlur={messageForm.handleBlur}
          />
          {fieldError(messageForm.errors.body, messageForm.touched.body)}
        </div>
      </Modal>

      {/* Send Email */}
      <Modal
        open={active === 'email'}
        onClose={onClose}
        title="Send Email"
        titleIcon="ti ti-mail"
        formClassName="workspace-validated-form"
        onSubmit={emailForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary workspace-submit">
              <i className="ti ti-send me-1" />
              Send Email
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="to">
            To <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className="form-control message-recipient"
            name="to"
            id="to"
            value={emailForm.values.to}
            onChange={emailForm.handleChange}
            onBlur={emailForm.handleBlur}
          />
          {fieldError(emailForm.errors.to, emailForm.touched.to)}
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="subject-2">
            Subject <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="subject"
            placeholder="Enter subject"
            id="subject-2"
            value={emailForm.values.subject}
            onChange={emailForm.handleChange}
            onBlur={emailForm.handleBlur}
          />
          {fieldError(emailForm.errors.subject, emailForm.touched.subject)}
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="message-2">
            Message <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            name="body"
            rows={4}
            placeholder="Type your email…"
            id="message-2"
            value={emailForm.values.body}
            onChange={emailForm.handleChange}
            onBlur={emailForm.handleBlur}
          />
          {fieldError(emailForm.errors.body, emailForm.touched.body)}
        </div>
      </Modal>
    </>
  );
};

export default ParentListModals;
