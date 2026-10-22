import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import CommonSelect from '@core/common/commonSelect';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { useForm } from '@hooks/useForm';
import { required } from '@utils/validation';
import type { AdmissionDetailsModalId } from '../data/admissionDetails.data';
import { profile } from '../data/admissionDetails.data';


const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

const fieldError = (message?: string, touched?: boolean) =>
  message && touched ? <div className="invalid-feedback d-block">{message}</div> : null;

export interface AdmissionDetailsModalsProps {
  active: AdmissionDetailsModalId | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onConfirmDelete: () => void;
}

const AdmissionDetailsModals = ({ active, onClose, onToast, onConfirmDelete }: AdmissionDetailsModalsProps) => {
  const collectForm = useForm<
    { feesType: string; amount: string; collectionDate: string; paymentType: string; notes: string },
    string
  >({
    initialValues: { feesType: 'Admission Fees', amount: '1500', collectionDate: '', paymentType: 'Cash', notes: '' },
    onSubmit: async () => 'Fees collected successfully',
    onSuccess: (message) => {
      onToast(message);
      collectForm.reset();
      onClose();
    },
  });

  const rejectForm = useForm<{ reason: string; notify: boolean }, string>({
    initialValues: { reason: '', notify: true },
    validationSchema: { reason: required('Enter a reason for rejection.') },
    onSubmit: async () => `${profile.name} rejected`,
    onSuccess: (message) => {
      onToast(message);
      rejectForm.reset();
      onClose();
    },
  });

  const waitlistForm = useForm<{ position: string; note: string }, string>({
    initialValues: { position: '', note: '' },
    onSubmit: async () => `${profile.name} moved to waitlist`,
    onSuccess: (message) => {
      onToast(message);
      waitlistForm.reset();
      onClose();
    },
  });

  const interviewForm = useForm<
    { date: string; time: string; mode: string; panel: string; location: string },
    string
  >({
    initialValues: { date: '', time: '', mode: 'In-person', panel: 'Teena Mathew', location: '' },
    validationSchema: {
      date: required('Select an interview date.'),
      time: required('Select a time.'),
    },
    onSubmit: async () => 'Interview scheduled',
    onSuccess: (message) => {
      onToast(message);
      interviewForm.reset();
      onClose();
    },
  });

  const assignForm = useForm<{ assignTo: string }, string>({
    initialValues: { assignTo: 'Teena Mathew' },
    onSubmit: async () => 'Application assigned',
    onSuccess: (message) => {
      onToast(message);
      assignForm.reset();
      onClose();
    },
  });

  const emailForm = useForm<{ template: string; subject: string; message: string }, string>({
    initialValues: { template: 'Application Received', subject: '', message: '' },
    onSubmit: async () => 'Email sent successfully',
    onSuccess: (message) => {
      onToast(message);
      emailForm.reset();
      onClose();
    },
  });

  const smsForm = useForm<{ template: string; message: string }, string>({
    initialValues: { template: 'Application Received', message: '' },
    onSubmit: async () => 'SMS sent successfully',
    onSuccess: (message) => {
      onToast(message);
      smsForm.reset();
      onClose();
    },
  });

  const importForm = useForm<Record<string, never>, string>({
    initialValues: {},
    onSubmit: async () => 'File queued for import',
    onSuccess: (message) => {
      onToast(message);
      onClose();
    },
  });

  const uploadForm = useForm<{ documentType: string; expiryDate: string }, string>({
    initialValues: { documentType: 'Birth Certificate', expiryDate: '' },
    onSubmit: async () => 'Document uploaded successfully',
    onSuccess: (message) => {
      onToast(message);
      uploadForm.reset();
      onClose();
    },
  });

  return (
    <>
      {/* Collect Fees Modal */}
      <Modal
        open={active === 'collectFees'}
        onClose={onClose}
        title="Collect Fees"
        dialogClassName="modal-lg"
        titleAccessory={<span className="badge badge-sm bg-primary ms-2">{profile.admissionNo}</span>}
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
            <div className="col-lg-4 col-md-6">
              <div className="d-flex align-items-center mb-3">
                <span className="avatar avatar-md me-2">
                  <ImageWithBasePath src={profile.avatar} alt={profile.name} />
                </span>
                <span className="d-flex flex-column">
                  <span className="text-dark">{profile.name}</span>
                  Class {profile.classApplied}
                </span>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="mb-3">
                <span className="fs-12 mb-1">Admission Fee</span>
                <p className="text-dark">$1,500</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="mb-3">
                <span className="badge badge-soft-danger">
                  <i className="ti ti-circle-filled me-2" />
                  Unpaid
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="fees-type">
                Fees Type
              </label>
              <CommonSelect
                inputId="fees-type"
                options={toOptions(['Admission Fees', 'Tuition Fees', 'Bus Fees'])}
                value={{ value: collectForm.values.feesType, label: collectForm.values.feesType }}
                onChange={(option) => collectForm.setFieldValue('feesType', option?.value ?? '')}
              />
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="amount">
                Amount
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Amount"
                id="amount"
                name="amount"
                value={collectForm.values.amount}
                onChange={collectForm.handleChange}
              />
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="collection-date">
                Collection Date
              </label>
              <div className="date-pic">
                <DateField
                  placeholder="Select"
                  id="collection-date"
                  value={collectForm.values.collectionDate}
                  onChange={(dateString) => collectForm.setFieldValue('collectionDate', dateString as string)}
                />
                <span className="cal-icon">
                  <i className="ti ti-calendar" />
                </span>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="payment-type">
                Payment Type
              </label>
              <CommonSelect
                inputId="payment-type"
                options={toOptions(['Cash', 'Card', 'Online'])}
                value={{ value: collectForm.values.paymentType, label: collectForm.values.paymentType }}
                onChange={(option) => collectForm.setFieldValue('paymentType', option?.value ?? '')}
              />
            </div>
          </div>
          <div className="col-12 col-lg-12">
            <div className="mb-0">
              <label className="form-label" htmlFor="notes-2">
                Notes
              </label>
              <textarea
                rows={3}
                className="form-control"
                placeholder="Add Notes"
                id="notes-2"
                name="notes"
                value={collectForm.values.notes}
                onChange={collectForm.handleChange}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Reject Application Modal */}
      <Modal
        open={active === 'rejectApplication'}
        onClose={onClose}
        title="Reject Application"
        onSubmit={rejectForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger">
              Reject Application
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="reason-for-rejection">
            Reason for Rejection <span className="text-danger">*</span>
          </label>
          <textarea
            rows={4}
            className="form-control"
            placeholder="Enter reason"
            id="reason-for-rejection"
            name="reason"
            value={rejectForm.values.reason}
            onChange={rejectForm.handleChange}
            onBlur={rejectForm.handleBlur}
          />
          {fieldError(rejectForm.errors.reason, rejectForm.touched.reason)}
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0 fs-15">Notify Parent</h5>
            <p className="fs-12 mb-0">Send rejection email to the parent</p>
          </div>
          <div className="status-toggle modal-status">
            <input
              type="checkbox"
              id="reject_notify"
              className="check"
              checked={rejectForm.values.notify}
              onChange={(event) => rejectForm.setFieldValue('notify', event.target.checked)}
            />
            <label htmlFor="reject_notify" className="checktoggle">
              {' '}
            </label>
          </div>
        </div>
      </Modal>

      {/* Waitlist Modal */}
      <Modal
        open={active === 'waitlistApplication'}
        onClose={onClose}
        title="Move to Waitlist"
        onSubmit={waitlistForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add to Waitlist
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="waitlist-position">
            Waitlist Position
          </label>
          <input
            type="number"
            className="form-control"
            placeholder="e.g. 5"
            min={1}
            id="waitlist-position"
            name="position"
            value={waitlistForm.values.position}
            onChange={waitlistForm.handleChange}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="note">
            Note
          </label>
          <textarea
            rows={3}
            className="form-control"
            placeholder="Add a note"
            id="note"
            name="note"
            value={waitlistForm.values.note}
            onChange={waitlistForm.handleChange}
          />
        </div>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        open={active === 'scheduleInterview'}
        onClose={onClose}
        title="Schedule Interview"
        dialogClassName="modal-lg"
        onSubmit={interviewForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Schedule
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="interview-date">
                Interview Date <span className="text-danger">*</span>
              </label>
              <div className="date-pic">
                <DateField
                  placeholder="Select"
                  id="interview-date"
                  value={interviewForm.values.date}
                  onChange={(dateString) => interviewForm.setFieldValue('date', dateString as string)}
                />
                <span className="cal-icon">
                  <i className="ti ti-calendar" />
                </span>
              </div>
              {fieldError(interviewForm.errors.date, interviewForm.touched.date)}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="time">
                Time <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control timepicker"
                placeholder="Select time"
                id="time"
                name="time"
                value={interviewForm.values.time}
                onChange={interviewForm.handleChange}
                onBlur={interviewForm.handleBlur}
              />
              {fieldError(interviewForm.errors.time, interviewForm.touched.time)}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="mode">
                Mode
              </label>
              <CommonSelect
                inputId="mode"
                options={toOptions(['In-person', 'Online'])}
                value={{ value: interviewForm.values.mode, label: interviewForm.values.mode }}
                onChange={(option) => interviewForm.setFieldValue('mode', option?.value ?? '')}
              />
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="panel-members">
                Panel Members
              </label>
              <CommonSelect
                inputId="panel-members"
                options={toOptions(['Teena Mathew', 'Daniel Josua', 'Hellana Robert'])}
                value={{ value: interviewForm.values.panel, label: interviewForm.values.panel }}
                onChange={(option) => interviewForm.setFieldValue('panel', option?.value ?? '')}
              />
            </div>
          </div>
          <div className="col-12 col-lg-12">
            <div className="mb-0">
              <label className="form-label" htmlFor="location-meeting-link">
                Location / Meeting Link
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Room 204 or https://meet..."
                id="location-meeting-link"
                name="location"
                value={interviewForm.values.location}
                onChange={interviewForm.handleChange}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Assign Staff Modal */}
      <Modal
        open={active === 'assignStaff'}
        onClose={onClose}
        title="Assign Staff"
        onSubmit={assignForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Assign
            </button>
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="assign-to">
            Assign To
          </label>
          <CommonSelect
            inputId="assign-to"
            options={toOptions(['Teena Mathew', 'Daniel Josua', 'Hellana Robert'])}
            value={{ value: assignForm.values.assignTo, label: assignForm.values.assignTo }}
            onChange={(option) => assignForm.setFieldValue('assignTo', option?.value ?? '')}
          />
        </div>
      </Modal>

      {/* Send Email Modal */}
      <Modal
        open={active === 'sendEmail'}
        onClose={onClose}
        title="Send Email"
        dialogClassName="modal-lg"
        onSubmit={emailForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Send Email
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="template">
            Template
          </label>
          <CommonSelect
            inputId="template"
            options={toOptions(['Application Received', 'Interview Invitation', 'Approval Notice'])}
            value={{ value: emailForm.values.template, label: emailForm.values.template }}
            onChange={(option) => emailForm.setFieldValue('template', option?.value ?? '')}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="subject">
            Subject
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter subject"
            id="subject"
            name="subject"
            value={emailForm.values.subject}
            onChange={emailForm.handleChange}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="message">
            Message
          </label>
          <textarea
            rows={5}
            className="form-control"
            placeholder="Write your message"
            id="message"
            name="message"
            value={emailForm.values.message}
            onChange={emailForm.handleChange}
          />
        </div>
      </Modal>

      {/* Send SMS Modal */}
      <Modal
        open={active === 'sendSms'}
        onClose={onClose}
        title="Send SMS"
        onSubmit={smsForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Send SMS
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="template-2">
            Template
          </label>
          <CommonSelect
            inputId="template-2"
            options={toOptions(['Application Received', 'Interview Reminder', 'Fee Reminder'])}
            value={{ value: smsForm.values.template, label: smsForm.values.template }}
            onChange={(option) => smsForm.setFieldValue('template', option?.value ?? '')}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="message-2">
            Message
          </label>
          <textarea
            rows={4}
            className="form-control"
            maxLength={160}
            placeholder="Max 160 characters"
            id="message-2"
            name="message"
            value={smsForm.values.message}
            onChange={smsForm.handleChange}
          />
        </div>
      </Modal>

      {/* Import Applications Modal */}
      <Modal
        open={active === 'importApplications'}
        onClose={onClose}
        title="Import Applications"
        onSubmit={importForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Import
            </button>
          </>
        }
      >
        <div className="alert alert-info d-flex align-items-center" role="alert">
          <i className="ti ti-info-circle me-2" />
          <span>
            Download the{' '}
            <a href="#sample-template" className="fw-semibold" onClick={(event) => event.preventDefault()}>
              sample template
            </a>{' '}
            before importing.
          </span>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="upload-file-csv-excel">
            Upload File (CSV / Excel)
          </label>
          <input type="file" className="form-control" accept=".csv,.xls,.xlsx" id="upload-file-csv-excel" />
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

      {/* Upload Document Modal */}
      <Modal
        open={active === 'uploadDocument'}
        onClose={onClose}
        title="Upload Document"
        onSubmit={uploadForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Upload
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="document-type">
            Document Type <span className="text-danger">*</span>
          </label>
          <CommonSelect
            inputId="document-type"
            options={toOptions(['Birth Certificate', 'Transfer Certificate', 'Aadhar / ID Proof', 'Address Proof', 'Medical Certificate'])}
            value={{ value: uploadForm.values.documentType, label: uploadForm.values.documentType }}
            onChange={(option) => uploadForm.setFieldValue('documentType', option?.value ?? '')}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="expiry-date">
            Expiry Date
          </label>
          <div className="date-pic">
            <DateField
              placeholder="Select"
              id="expiry-date"
              value={uploadForm.values.expiryDate}
              onChange={(dateString) => uploadForm.setFieldValue('expiryDate', dateString as string)}
            />
            <span className="cal-icon">
              <i className="ti ti-calendar" />
            </span>
          </div>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="file">
            File <span className="text-danger">*</span>
          </label>
          <input type="file" className="form-control" accept=".pdf,.jpg,.jpeg,.png" required id="file" />
          <small className="text-muted">PDF, JPG or PNG · max 5 MB</small>
        </div>
      </Modal>
    </>
  );
};

export default AdmissionDetailsModals;
