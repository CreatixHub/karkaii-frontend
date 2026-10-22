import { useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import CommonSelect from '@core/common/commonSelect';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { useForm } from '@hooks/useForm';
import type { ToastVariant } from '@hooks/useToasts';
import { email as emailRule, required } from '@utils/validation';
import type { StudentListModalId, StudentRow } from '../data/studentsList.data';
import {
  collectFeesSummary,
  feesGroups,
  feesTypes,
  importModes,
  loginDetailRows,
  paymentTypes,
} from '../data/studentListModals.data';

const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

// The template's `To` field is `type="email" required`, so both rules share the
// browser's single message.
const requiredEmail = required('Please enter a valid email address.');
const validEmail = emailRule('Please enter a valid email address.');

const fieldError = (message?: string, touched?: boolean) =>
  message && touched ? <div className="invalid-feedback d-block">{message}</div> : null;

export interface StudentListModalsProps {
  active: StudentListModalId | null;
  /** The row that opened the dialog; the bulk bar passes null. */
  student: StudentRow | null;
  selectedCount: number;
  /** Menu label that opened the generic info / bulk / confirm dialogs. */
  context: string;
  onClose: () => void;
  onToast: (message: string, variant?: ToastVariant) => void;
  onConfirmDelete: () => void;
  /** Runs when the generic confirm dialog is accepted. */
  onConfirmAction: () => void;
}

const StudentListModals = ({
  active,
  student,
  selectedCount,
  context,
  onClose,
  onToast,
  onConfirmDelete,
  onConfirmAction,
}: StudentListModalsProps) => {
  const [importFile, setImportFile] = useState('');

  /* ------------------------------ Import Students --------------------------- */
  const importForm = useForm<{ mode: string }, string>({
    initialValues: { mode: importModes[0] },
    onSubmit: async () => 'File queued — 11 rows validated.',
    onSuccess: (message) => {
      onToast(message);
      importForm.reset();
      onClose();
    },
  });

  /* ------------------------------- Collect Fees ----------------------------- */
  const collectForm = useForm<
    {
      feesGroup: string;
      feesType: string;
      amount: string;
      collectionDate: string;
      paymentType: string;
      reference: string;
      status: boolean;
      notes: string;
    },
    string
  >({
    initialValues: {
      feesGroup: '',
      feesType: '',
      amount: '',
      collectionDate: '',
      paymentType: '',
      reference: '',
      status: false,
      notes: '',
    },
    onSubmit: async () => 'Fees collected successfully',
    onSuccess: (message) => {
      onToast(message);
      collectForm.reset();
      onClose();
    },
  });

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
      to: (value, values) =>
        requiredEmail(value, values) ?? validEmail(value, values),
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

  /* -------------------------------- Save view ------------------------------- */
  const saveViewForm = useForm<{ viewname: string }, string>({
    initialValues: { viewname: '' },
    validationSchema: { viewname: required('Please name this view.') },
    onSubmit: async () => 'View saved',
    onSuccess: (message) => {
      onToast(message);
      saveViewForm.reset();
      onClose();
    },
  });

  /* ------------------------------- Bulk action ------------------------------ */
  const bulkForm = useForm<Record<string, never>, string>({
    initialValues: {},
    onSubmit: async () => `${context} applied to ${selectedCount} student(s).`,
    onSuccess: (message) => {
      onToast(message);
      onClose();
    },
  });

  const classLabel = student ? `${student.level}, ${student.section}` : '';

  return (
    <>
      {/* Import Students */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Students"
        formClassName="validated-form"
        onSubmit={importForm.handleSubmit}
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
          <input type="file" aria-label="Student list file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="import-mode"
            name="mode"
            value={importForm.values.mode}
            onChange={importForm.handleChange}
          >
            {importModes.map((mode) => (
              <option key={mode}>{mode}</option>
            ))}
          </select>
        </div>
        <div className="alert alert-light border d-flex align-items-start gap-2 mb-0" role="note">
          <i className="ti ti-download fs-16" />
          <span className="fs-12">
            Not sure about the format? Download the template with all required columns and sample
            rows.
          </span>
        </div>
      </Modal>

      {/* Login Details */}
      <Modal
        open={active === 'loginDetail'}
        onClose={onClose}
        title="Login Details"
        dialogClassName="modal-lg"
        footer={
          <button type="button" className="btn btn-light me-2" onClick={onClose}>
            Cancel
          </button>
        }
      >
        <div className="student-detail-info">
          <span className="student-img">
            <ImageWithBasePath src={student?.avatar ?? ''} alt="Img" />
          </span>
          <div className="name-info">
            <h5 className="fs-15">
              {student?.name} <span>{classLabel}</span>
            </h5>
          </div>
        </div>
        <div className="table-responsive custom-table no-datatable_length">
          <table className="table datanew">
            <thead className="thead-light">
              <tr>
                <th>User Type</th>
                <th>User Name</th>
                <th>Password </th>
              </tr>
            </thead>
            <tbody>
              {loginDetailRows.map((row) => (
                <tr key={row.userType}>
                  <td>{row.userType}</td>
                  <td>{row.userName}</td>
                  <td>{row.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Delete Modal */}
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

      {/* Add Fees Collect */}
      <Modal
        open={active === 'collectFees'}
        onClose={onClose}
        title="Collect Fees"
        dialogClassName="modal-lg"
        titleAccessory={
          <span className="badge badge-sm bg-primary ms-2">{collectFeesSummary.admissionNo}</span>
        }
        onSubmit={collectForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Pay Fees
            </button>
          </>
        }
      >
        <div className="bg-light-300 p-3 pb-0 rounded mb-4">
          <div className="row align-items-center">
            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center mb-3">
                <span className="avatar avatar-md me-2">
                  <ImageWithBasePath src={student?.avatar ?? ''} alt="img" />
                </span>
                <span className="d-flex flex-column">
                  <span className="text-dark">{student?.name}</span>
                  {classLabel}
                </span>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="mb-3">
                <span className="fs-12 mb-1">Total Outstanding</span>
                <p className="text-dark">{collectFeesSummary.outstanding}</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="mb-3">
                <span className="fs-12 mb-1">Last Date</span>
                <p className="text-dark">{collectFeesSummary.lastDate}</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="mb-3">
                <span className="badge badge-soft-danger">
                  <i className="ti ti-circle-filled me-2" />
                  {collectFeesSummary.statusLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-6 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="fees-group">
                Fees Group
              </label>
              <CommonSelect
                inputId="fees-group"
                options={toOptions(feesGroups)}
                value={
                  collectForm.values.feesGroup
                    ? { value: collectForm.values.feesGroup, label: collectForm.values.feesGroup }
                    : null
                }
                onChange={(option) => collectForm.setFieldValue('feesGroup', option?.value ?? '')}
              />
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="fees-type">
                Fees Type
              </label>
              <CommonSelect
                inputId="fees-type"
                options={toOptions(feesTypes)}
                value={
                  collectForm.values.feesType
                    ? { value: collectForm.values.feesType, label: collectForm.values.feesType }
                    : null
                }
                onChange={(option) => collectForm.setFieldValue('feesType', option?.value ?? '')}
              />
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="amount">
                Amount
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Amout"
                id="amount"
                name="amount"
                value={collectForm.values.amount}
                onChange={collectForm.handleChange}
              />
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="collection-date">
                Collection Date
              </label>
              <div className="date-pic">
                <DateField
                  placeholder="Select"
                  id="collection-date"
                  onChange={(dateString) =>
                    collectForm.setFieldValue('collectionDate', dateString as string)
                  }
                />
                <span className="cal-icon">
                  <i className="ti ti-calendar" />
                </span>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="payment-type">
                Payment Type
              </label>
              <CommonSelect
                inputId="payment-type"
                options={toOptions(paymentTypes)}
                value={
                  collectForm.values.paymentType
                    ? {
                        value: collectForm.values.paymentType,
                        label: collectForm.values.paymentType,
                      }
                    : null
                }
                onChange={(option) => collectForm.setFieldValue('paymentType', option?.value ?? '')}
              />
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="payment-reference-no">
                Payment Reference No
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Payment Reference No"
                id="payment-reference-no"
                name="reference"
                value={collectForm.values.reference}
                onChange={collectForm.handleChange}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="modal-satus-toggle d-flex align-items-center justify-content-between mb-3">
              <div className="status-title">
                <h5>Status</h5>
                <p>Change the Status by toggle </p>
              </div>
              <div className="status-toggle modal-status">
                <input
                  type="checkbox"
                  id="user1"
                  className="check"
                  checked={collectForm.values.status}
                  onChange={(event) => collectForm.setFieldValue('status', event.target.checked)}
                />
                <label htmlFor="user1" className="checktoggle">
                  {' '}
                </label>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="mb-0">
              <label className="form-label" htmlFor="notes">
                Notes
              </label>
              <textarea
                rows={4}
                className="form-control"
                placeholder="Add Notes"
                id="notes"
                name="notes"
                value={collectForm.values.notes}
                onChange={collectForm.handleChange}
              />
            </div>
          </div>
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
          <input
            type="text"
            className="form-control message-recipient"
            readOnly
            id="recipient"
            value={student ? `${student.detail.guardian} · ${student.detail.phone}` : ''}
          />
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

      {/* Email */}
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

      {/* Call */}
      <Modal
        open={active === 'call'}
        onClose={onClose}
        title="Call"
        hideHeader
        dialogClassName="modal-sm"
        bodyClassName="text-center p-4"
      >
        <span className="avatar avatar-xl rounded-circle flex-shrink-0 bg-success-transparent text-success mb-3 mx-auto d-flex align-items-center justify-content-center">
          <i className="ti ti-phone fs-24" />
        </span>
        <h5 className="contact-call-name mb-1">{student?.detail.guardian ?? '—'}</h5>
        <p className="text-muted mb-1">Parent / Guardian</p>
        <h4 className="message-recipient mb-3">{student?.detail.phone ?? '—'}</h4>
        <div className="d-flex justify-content-center gap-2">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-success contact-call-button"
            onClick={() => {
              onToast(`Calling ${student?.detail.guardian ?? 'parent'}…`, 'info');
              onClose();
            }}
          >
            <i className="ti ti-phone-call me-1" />
            Call Now
          </button>
        </div>
      </Modal>

      {/* Workspace Import */}
      <Modal
        open={active === 'swImport'}
        onClose={onClose}
        title="Import Students"
        titleIcon="ti ti-upload"
        footer={
          <>
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary import-start"
              disabled={!importFile}
              onClick={() => {
                onToast('File queued — 11 rows validated.');
                setImportFile('');
                onClose();
              }}
            >
              <i className="ti ti-upload me-1" />
              Import
            </button>
          </>
        }
      >
        <div className="alert alert-light border d-flex align-items-center justify-content-between">
          <span>
            <i className="ti ti-file-spreadsheet me-1" />
            Need a template?
          </span>
          <button
            type="button"
            className="btn btn-sm btn-light import-template"
            onClick={() => onToast('Sample CSV downloaded.', 'info')}
          >
            <i className="ti ti-download me-1" />
            Download sample CSV
          </button>
        </div>
        <label className="upload-dropzone" htmlFor="sw_import_file">
          <i className="ti ti-cloud-upload" />
          <span className="upload-dropzone-title">Click to browse or drag a file here</span>
          <span className="upload-dropzone-hint">Supported: .csv, .xls, .xlsx (max 5 MB)</span>
          <input
            type="file"
            id="sw_import_file"
            accept=".csv,.xls,.xlsx"
            hidden
            onChange={(event) => setImportFile(event.target.files?.[0]?.name ?? '')}
          />
        </label>
        <div
          className={`import-file ${importFile ? 'd-flex' : 'd-none'} align-items-center gap-2 mt-3`}
        >
          <i className="ti ti-file-type-csv fs-24 text-primary" />
          <div className="flex-grow-1">
            <div className="import-file-name fw-medium">{importFile || '—'}</div>
            <div className="progress mt-1" style={{ height: 6 }}>
              <div
                className="progress-bar import-progress-bar"
                style={{ width: importFile ? '100%' : '0%' }}
              />
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-icon btn-light import-file-remove"
            onClick={() => setImportFile('')}
          >
            <i className="ti ti-x" />
          </button>
        </div>
      </Modal>

      {/* Generic info modal */}
      <Modal
        open={active === 'info'}
        onClose={onClose}
        title={context || 'Details'}
        titleIcon="ti ti-info-circle"
        dialogClassName="modal-lg"
        bodyClassName="info-modal-body"
        footer={
          <button type="button" className="btn btn-light" onClick={onClose}>
            Close
          </button>
        }
      >
        {student ? (
          <ul className="list-unstyled fs-12 mb-0">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Student</span>
              <span className="fw-medium">{student.name}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Roll No</span>
              <span className="fw-medium">{student.detail.rollNo}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Class</span>
              <span className="fw-medium">
                {student.classText} · {student.sectionText}
              </span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Date of Birth</span>
              <span className="fw-medium">{student.detail.dateOfBirth}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Blood Group</span>
              <span className="badge badge-soft-danger">{student.detail.bloodGroup}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Parent / Guardian</span>
              <span className="fw-medium">{student.detail.guardian}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Address</span>
              <span className="fw-medium">{student.detail.address}</span>
            </li>
          </ul>
        ) : null}
      </Modal>

      {/* Generic bulk form */}
      <Modal
        open={active === 'bulk'}
        onClose={onClose}
        title={context || 'Bulk Action'}
        titleIcon="ti ti-checkbox"
        formClassName="workspace-validated-form"
        onSubmit={bulkForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary workspace-submit">
              <i className="ti ti-check me-1" />
              Apply
            </button>
          </>
        }
      >
        <div className="alert alert-primary bg-primary-transparent border-0 d-flex align-items-center">
          <i className="ti ti-users me-2" />
          Applying to <strong className="mx-1 selection-count-value">{selectedCount}</strong>
          &nbsp;selected student(s).
        </div>
        <div className="selection-form-fields" />
      </Modal>

      {/* Save view */}
      <Modal
        open={active === 'saveView'}
        onClose={onClose}
        title="Save View"
        titleIcon="ti ti-bookmark"
        dialogClassName="modal-sm"
        formClassName="workspace-validated-form"
        onSubmit={saveViewForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary workspace-submit">
              <i className="ti ti-check me-1" />
              Save
            </button>
          </>
        }
      >
        <label className="form-label" htmlFor="view-name">
          View name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          name="viewname"
          placeholder="e.g. Class III Active"
          id="view-name"
          value={saveViewForm.values.viewname}
          onChange={saveViewForm.handleChange}
          onBlur={saveViewForm.handleBlur}
        />
        {fieldError(saveViewForm.errors.viewname, saveViewForm.touched.viewname)}
      </Modal>

      {/* Generic confirm */}
      <Modal
        open={active === 'confirm'}
        onClose={onClose}
        title="Are you sure?"
        hideHeader
        bodyClassName="text-center p-4"
      >
        <span className="confirm-icon">
          <i className="ti ti-alert-triangle" />
        </span>
        <h4 className="confirm-title mt-3">Are you sure?</h4>
        <p className="confirm-text text-muted">This action cannot be undone.</p>
        <div className="d-flex justify-content-center gap-2">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger confirm-accept" onClick={onConfirmAction}>
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
};

export default StudentListModals;
