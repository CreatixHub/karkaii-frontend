import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import CommonSelect from '@core/common/commonSelect';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { useForm } from '@hooks/useForm';
import { required } from '@utils/validation';
import type { AdmissionModalId, AdmissionRow } from '../data/admissions.data';


const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

const fieldError = (message?: string, touched?: boolean) =>
  message && touched ? <div className="invalid-feedback d-block">{message}</div> : null;

export interface AdmissionModalsProps {
  active: AdmissionModalId | null;
  /** The row that opened the dialog; the toolbar's import/new/delete pass null. */
  row: AdmissionRow | null;
  onClose: () => void;
  onOpenModal: (modal: AdmissionModalId) => void;
  onToast: (message: string) => void;
  onConfirmDelete: () => void;
}

const AdmissionModals = ({
  active,
  row,
  onClose,
  onOpenModal,
  onToast,
  onConfirmDelete,
}: AdmissionModalsProps) => {
  const admissionNo = row?.admissionNo ?? 'ADM202501';

  /* ------------------------------ New Admission ------------------------------ */
  const newAdmissionForm = useForm<
    {
      firstName: string;
      lastName: string;
      gender: string;
      dob: string;
      classApplyingFor: string;
      parentName: string;
      mobile: string;
      email: string;
      source: string;
      previousSchool: string;
    },
    string
  >({
    initialValues: {
      firstName: '',
      lastName: '',
      gender: 'Male',
      dob: '',
      classApplyingFor: 'Class I',
      parentName: '',
      mobile: '',
      email: '',
      source: 'Walk-in',
      previousSchool: '',
    },
    validationSchema: {
      firstName: required('Enter a first name.'),
      lastName: required('Enter a last name.'),
    },
    onSubmit: async () => 'Application created successfully',
    onSuccess: (message) => {
      onToast(message);
      newAdmissionForm.reset();
      onClose();
    },
  });

  /* -------------------------------- Collect Fees ------------------------------ */
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

  /* ------------------------------ Reject Application -------------------------- */
  const rejectForm = useForm<{ reason: string; notify: boolean }, string>({
    initialValues: { reason: '', notify: true },
    validationSchema: { reason: required('Enter a reason for rejection.') },
    onSubmit: async () => `${row?.name ?? 'Application'} rejected`,
    onSuccess: (message) => {
      onToast(message);
      rejectForm.reset();
      onClose();
    },
  });

  /* ---------------------------------- Waitlist --------------------------------- */
  const waitlistForm = useForm<{ position: string; note: string }, string>({
    initialValues: { position: '', note: '' },
    onSubmit: async () => `${row?.name ?? 'Application'} moved to waitlist`,
    onSuccess: (message) => {
      onToast(message);
      waitlistForm.reset();
      onClose();
    },
  });

  /* ------------------------------ Schedule Interview --------------------------- */
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

  /* ---------------------------------- Assign Staff ------------------------------ */
  const assignForm = useForm<{ assignTo: string }, string>({
    initialValues: { assignTo: 'Teena Mathew' },
    onSubmit: async () => 'Application assigned',
    onSuccess: (message) => {
      onToast(message);
      assignForm.reset();
      onClose();
    },
  });

  /* ----------------------------------- Send Email -------------------------------- */
  const emailForm = useForm<{ template: string; subject: string; message: string }, string>({
    initialValues: { template: 'Application Received', subject: '', message: '' },
    onSubmit: async () => 'Email sent successfully',
    onSuccess: (message) => {
      onToast(message);
      emailForm.reset();
      onClose();
    },
  });

  /* ----------------------------------- Send SMS ----------------------------------- */
  const smsForm = useForm<{ template: string; message: string }, string>({
    initialValues: { template: 'Application Received', message: '' },
    onSubmit: async () => 'SMS sent successfully',
    onSuccess: (message) => {
      onToast(message);
      smsForm.reset();
      onClose();
    },
  });

  /* ------------------------------- Import Applications ---------------------------- */
  const importForm = useForm<Record<string, never>, string>({
    initialValues: {},
    onSubmit: async () => 'File queued for import',
    onSuccess: (message) => {
      onToast(message);
      onClose();
    },
  });

  return (
    <>
      {/* New Admission Modal */}
      <Modal
        open={active === 'newAdmission'}
        onClose={onClose}
        title="New Admission"
        dialogClassName="modal-lg"
        onSubmit={newAdmissionForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={newAdmissionForm.isSubmitting}>
              Create Application
            </button>
          </>
        }
      >
        <h5 className="mb-3 fs-15">Applicant Details</h5>
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="first-name">
                First Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter first name"
                id="first-name"
                name="firstName"
                value={newAdmissionForm.values.firstName}
                onChange={newAdmissionForm.handleChange}
                onBlur={newAdmissionForm.handleBlur}
              />
              {fieldError(newAdmissionForm.errors.firstName, newAdmissionForm.touched.firstName)}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="last-name">
                Last Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter last name"
                id="last-name"
                name="lastName"
                value={newAdmissionForm.values.lastName}
                onChange={newAdmissionForm.handleChange}
                onBlur={newAdmissionForm.handleBlur}
              />
              {fieldError(newAdmissionForm.errors.lastName, newAdmissionForm.touched.lastName)}
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="mb-3">
              <label className="form-label" htmlFor="gender-2">
                Gender
              </label>
              <CommonSelect
                inputId="gender-2"
                options={toOptions(['Male', 'Female'])}
                value={{ value: newAdmissionForm.values.gender, label: newAdmissionForm.values.gender }}
                onChange={(option) => newAdmissionForm.setFieldValue('gender', option?.value ?? '')}
              />
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="mb-3">
              <label className="form-label" htmlFor="date-of-birth">
                Date of Birth
              </label>
              <div className="date-pic">
                <DateField
                  placeholder="Select"
                  id="date-of-birth"
                  value={newAdmissionForm.values.dob}
                  onChange={(dateString) => newAdmissionForm.setFieldValue('dob', dateString as string)}
                />
                <span className="cal-icon">
                  <i className="ti ti-calendar" />
                </span>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="mb-3">
              <label className="form-label" htmlFor="class-applying-for">
                Class Applying For
              </label>
              <CommonSelect
                inputId="class-applying-for"
                options={toOptions(['Class I', 'Class II', 'Class III', 'Class IV'])}
                value={{ value: newAdmissionForm.values.classApplyingFor, label: newAdmissionForm.values.classApplyingFor }}
                onChange={(option) => newAdmissionForm.setFieldValue('classApplyingFor', option?.value ?? '')}
              />
            </div>
          </div>
        </div>
        <h6 className="mb-3 mt-2">Parent / Guardian</h6>
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="parent-name">
                Parent Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter parent name"
                id="parent-name"
                name="parentName"
                value={newAdmissionForm.values.parentName}
                onChange={newAdmissionForm.handleChange}
              />
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="mobile-number">
                Mobile Number
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter mobile number"
                id="mobile-number"
                name="mobile"
                value={newAdmissionForm.values.mobile}
                onChange={newAdmissionForm.handleChange}
              />
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                id="email"
                name="email"
                value={newAdmissionForm.values.email}
                onChange={newAdmissionForm.handleChange}
              />
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="source-3">
                Source
              </label>
              <CommonSelect
                inputId="source-3"
                options={toOptions(['Walk-in', 'Website', 'Referral', 'Campaign'])}
                value={{ value: newAdmissionForm.values.source, label: newAdmissionForm.values.source }}
                onChange={(option) => newAdmissionForm.setFieldValue('source', option?.value ?? '')}
              />
            </div>
          </div>
          <div className="col-12 col-lg-12">
            <div className="mb-0">
              <label className="form-label" htmlFor="previous-school">
                Previous School
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter previous school"
                id="previous-school"
                name="previousSchool"
                value={newAdmissionForm.values.previousSchool}
                onChange={newAdmissionForm.handleChange}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Document Verification Modal */}
      <Modal
        open={active === 'documentVerification'}
        onClose={onClose}
        title="Document Verification"
        dialogClassName="modal-lg"
        titleAccessory={<span className="badge badge-sm bg-primary ms-2">{admissionNo}</span>}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onToast('All documents marked verified');
                onClose();
              }}
            >
              Mark All Verified
            </button>
          </>
        }
      >
        <p className="text-muted mb-3">
          Review each uploaded document and mark it verified or request a re-upload.
        </p>
        <div className="list-group">
          <div className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center">
              <span className="adm-doc-ic bg-primary-transparent text-primary me-2">
                <i className="ti ti-photo" />
              </span>
              <div>
                <p className="mb-0 fw-semibold">Student Photograph</p>
                <span className="fs-12 text-muted">JPG - 02 Jul 2026</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button type="button" className="btn btn-sm btn-outline-light bg-white">
                <i className="ti ti-eye me-1" />
                Preview
              </button>
              <span className="badge badge-soft-success">
                <i className="ti ti-circle-filled fs-5 me-1" />
                Verified
              </span>
            </div>
          </div>
          <div className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center">
              <span className="adm-doc-ic bg-info-transparent text-info me-2">
                <i className="ti ti-certificate" />
              </span>
              <div>
                <p className="mb-0 fw-semibold">Birth Certificate</p>
                <span className="fs-12 text-muted">PDF - 02 Jul 2026</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button type="button" className="btn btn-sm btn-outline-light bg-white">
                <i className="ti ti-eye me-1" />
                Preview
              </button>
              <span className="badge badge-soft-success">
                <i className="ti ti-circle-filled fs-5 me-1" />
                Verified
              </span>
            </div>
          </div>
          <div className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center">
              <span className="adm-doc-ic bg-warning-transparent text-warning me-2">
                <i className="ti ti-file-text" />
              </span>
              <div>
                <p className="mb-0 fw-semibold">Transfer Certificate</p>
                <span className="fs-12 text-muted">PDF - 03 Jul 2026</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button type="button" className="btn btn-sm btn-outline-light bg-white">
                <i className="ti ti-eye me-1" />
                Preview
              </button>
              <button
                type="button"
                className="btn btn-sm btn-success"
                onClick={() => onToast('Transfer Certificate verified')}
              >
                <i className="ti ti-check me-1" />
                Verify
              </button>
            </div>
          </div>
          <div className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center">
              <span className="adm-doc-ic bg-danger-transparent text-danger me-2">
                <i className="ti ti-home" />
              </span>
              <div>
                <p className="mb-0 fw-semibold">Address Proof</p>
                <span className="fs-12 text-muted">Not uploaded</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge badge-soft-danger">
                <i className="ti ti-circle-filled fs-5 me-1" />
                Missing
              </span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Admission Letter Preview Modal */}
      <Modal
        open={active === 'admissionLetter'}
        onClose={onClose}
        title="Admission Letter Preview"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-outline-light bg-white" onClick={() => window.print()}>
              <i className="ti ti-printer me-1" />
              Print
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onToast('Admission letter downloaded');
                onClose();
              }}
            >
              <i className="ti ti-download me-1" />
              Download PDF
            </button>
          </>
        }
      >
        <div className="border rounded p-4 bg-white">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <ImageWithBasePath src="assets/img/karkaii-logo.png" alt="Logo" height={32} />
            <div className="text-end">
              <h5 className="mb-0 fs-15">Global International School</h5>
              <span className="fs-12 text-muted">Springfield Campus</span>
            </div>
          </div>
          <h5 className="text-center mb-3">Letter of Admission</h5>
          <p>
            Dear <b>{row?.parentName ?? 'Antony Maria'}</b>,
          </p>
          <p>
            We are pleased to inform you that <b>{row?.name ?? 'Aaralyn Maria'}</b> (Application No.{' '}
            <b>{admissionNo}</b>) has been granted admission to <b>{row?.classApplied ?? 'Class I'}</b> for the
            academic year <b>2024 / 2025</b>.
          </p>
          <p>
            Kindly complete the admission fee payment of <b>$1,500</b> on or before the reporting date to
            confirm the seat. We look forward to welcoming your child to our school family.
          </p>
          <p className="mb-4">
            Warm regards,
            <br />
            Admissions Office
          </p>
          <div className="d-flex justify-content-between align-items-end">
            <span className="fs-12 text-muted">Issued on 26 Jul 2026</span>
            <div className="text-center">
              <span className="d-block border-top pt-1 fs-12">Principal Signature</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Communication History Modal */}
      <Modal
        open={active === 'communicationHistory'}
        onClose={onClose}
        title="Communication History"
        dialogClassName="modal-lg"
        titleAccessory={<span className="badge badge-sm bg-primary ms-2">{admissionNo}</span>}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onOpenModal('sendEmail')}>
              <i className="ti ti-mail me-1" />
              New Message
            </button>
          </>
        }
      >
        <div className="adm-timeline">
          <div className="adm-tl-item">
            <div className="adm-tl-title">Application Received Email</div>
            <div className="adm-tl-meta">
              <i className="ti ti-mail me-1" />
              02 Jul 2026, 09:12 AM - by System
            </div>
            <p className="adm-tl-text">Acknowledgement of the submitted application was emailed to the parent.</p>
          </div>
          <div className="adm-tl-item">
            <div className="adm-tl-title">Document Request SMS</div>
            <div className="adm-tl-meta">
              <i className="ti ti-message me-1" />
              05 Jul 2026, 03:40 PM - by Teena Mathew
            </div>
            <p className="adm-tl-text">Parent reminded to upload the pending Transfer Certificate.</p>
          </div>
          <div className="adm-tl-item">
            <div className="adm-tl-title">Phone Call - Follow up</div>
            <div className="adm-tl-meta">
              <i className="ti ti-phone me-1" />
              12 Jul 2026, 11:05 AM - by Teena Mathew
            </div>
            <p className="adm-tl-text">Discussed interview availability and fee payment options.</p>
          </div>
          <div className="adm-tl-item">
            <div className="adm-tl-title">Interview Invitation Email</div>
            <div className="adm-tl-meta">
              <i className="ti ti-mail me-1" />
              20 Jul 2026, 10:00 AM - by System
            </div>
            <p className="adm-tl-text">Interview scheduling link shared with the parent.</p>
          </div>
        </div>
      </Modal>

      {/* Collect Fees Modal */}
      <Modal
        open={active === 'collectFees'}
        onClose={onClose}
        title="Collect Fees"
        dialogClassName="modal-lg"
        titleAccessory={<span className="badge badge-sm bg-primary ms-2">{admissionNo}</span>}
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
                  <ImageWithBasePath src={row?.avatar ?? 'assets/img/students/student-01.jpg'} alt={row?.name ?? 'Student'} />
                </span>
                <span className="d-flex flex-column">
                  <span className="text-dark">{row?.name ?? 'Aaralyn Maria'}</span>
                  {row?.classApplied ?? 'Class I'}
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
              <label className="form-label" htmlFor="notes">
                Notes
              </label>
              <textarea
                rows={3}
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
            Download the <a href="#sample-template" className="fw-semibold" onClick={(event) => event.preventDefault()}>sample template</a> before importing.
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
    </>
  );
};

export default AdmissionModals;
