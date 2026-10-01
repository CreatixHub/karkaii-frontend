import DateField from '@components/ui/DateField';
import MultiSelect from '@components/ui/MultiSelect';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import { all_routes } from '@/routes/all_routes';
import { useForm } from '@hooks/useForm';
import { required } from '@utils/validation';
import type { ChildContext, ParentModalId } from '../data/parentDashboard.data';

const routes = all_routes;
const TIMETABLE = [
  { id: 'tt1', accent: 'accent-success', time: '08:00', title: 'Mathematics', detail: 'Ms. Teresa Susan · Room 204' },
  { id: 'tt2', accent: 'accent-danger live', time: '09:00', title: 'Science — Physics', detail: 'Mr. John Doe · Lab 02' },
  { id: 'tt3', accent: 'accent-warning', time: '10:15', title: 'English', detail: 'Ms. Rita Owen · Room 108' },
  { id: 'tt4', accent: 'accent-info', time: '11:15', title: 'Social Studies', detail: 'Mr. Alan Poe · Room 110' },
  { id: 'tt5', accent: 'accent-purple', time: '13:00', title: 'Computer Science', detail: 'Ms. Nina Patel · Lab 01' },
];

const PAYMENT_METHODS = ['Credit / Debit Card', 'Net Banking', 'UPI'];
const MESSAGE_RECIPIENTS = [
  'Ms. Teresa Susan — Mathematics',
  'Mr. John Doe — Science',
  'Ms. Rita Owen — English',
  "Principal's Office",
];
const MEETING_RECIPIENTS = [
  'Ms. Teresa Susan — Class Teacher',
  'School Counsellor',
  'Principal',
];
const LEAVE_TYPES = ['Sick Leave', 'Family Function', 'Medical', 'Other'];
interface ChildOption {
  value: string;
  label: string;
}

/** The template preselects Janet and Joann. */
const CHILD_OPTIONS: ChildOption[] = [
  { value: 'Janet', label: 'Janet' },
  { value: 'Joann', label: 'Joann' },
  { value: 'Kathleen', label: 'Kathleen' },
  { value: 'Gifford', label: 'Gifford' },
];
const SELECTED_CHILDREN = CHILD_OPTIONS.slice(0, 2).map((option) => option.value);

export interface ParentModalsProps {
  active: ParentModalId | null;
  onClose: () => void;
  onToast: (message: string) => void;
  child: ChildContext;
}

const ParentModals = ({ active, onClose, onToast, child }: ParentModalsProps) => {
  const fieldError = (message?: string, touched?: boolean) =>
    touched && message ? (
      <span className="text-danger fs-12 d-block mt-1">{message}</span>
    ) : null;

  /** Shared success path: toast the template's copy, reset, close. */
  const settle = (message: string, reset: () => void) => {
    onToast(message);
    reset();
    onClose();
  };

  const payForm = useForm<{ method: string; card: string; expiry: string; cvv: string }, void>({
    initialValues: { method: PAYMENT_METHODS[0], card: '', expiry: '', cvv: '' },
    validationSchema: {
      card: required('Card number is required'),
      expiry: required('Expiry is required'),
      cvv: required('CVV is required'),
    },
    onSubmit: async () => undefined,
    onSuccess: () =>
      settle('Payment successful — receipt sent to your email.', payForm.reset),
  });

  const messageForm = useForm<{ to: string; subject: string; message: string }, void>({
    initialValues: { to: MESSAGE_RECIPIENTS[0], subject: '', message: '' },
    validationSchema: {
      subject: required('Subject is required'),
      message: required('Message is required'),
    },
    onSubmit: async () => undefined,
    onSuccess: () => settle('Message sent to teacher.', messageForm.reset),
  });

  const meetingForm = useForm<{ with: string; date: string; time: string; agenda: string }, void>({
    initialValues: { with: MEETING_RECIPIENTS[0], date: '', time: '', agenda: '' },
    validationSchema: {
      date: required('Choose a date'),
      time: required('Choose a time'),
    },
    onSubmit: async () => undefined,
    onSuccess: () => settle('Meeting request sent.', meetingForm.reset),
  });

  const leaveForm = useForm<{ type: string; from: string; to: string; reason: string }, void>({
    initialValues: { type: LEAVE_TYPES[0], from: '', to: '', reason: '' },
    validationSchema: {
      from: required('Choose a start date'),
      to: required('Choose an end date'),
      reason: required('Reason is required'),
    },
    onSubmit: async () => undefined,
    onSuccess: () => settle('Leave request submitted.', leaveForm.reset),
  });

  const parentForm = useForm<
    { name: string; phone: string; email: string; children: string[] },
    void
  >({
    // The template ships this dialog prefilled.
    initialValues: {
      name: 'Thomas',
      phone: '+1 65738 58937',
      email: 'thomas@example.com',
      children: SELECTED_CHILDREN,
    },
    validationSchema: {
      name: required('Name is required'),
      phone: required('Phone number is required'),
      email: required('Email address is required'),
    },
    onSubmit: async () => undefined,
    onSuccess: () => settle('Parent details updated.', parentForm.reset),
  });

  const cancelButton = (
    <button type="button" className="portal-button me-1 d-inline-flex align-items-center text-nowrap text-decoration-none" onClick={onClose}>
      Cancel
    </button>
  );

  return (
    <>
      {/* ------------------------------- Timetable ---------------------------- */}
      <Modal
        open={active === 'timetable'}
        onClose={onClose}
        title={`${child.name.split(' ')[0]}'s Timetable`}
        titleIcon="ti ti-table"
        contentClassName="parent-portal"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <>
            <Link to={routes.classTimetable} className="portal-button d-inline-flex align-items-center text-nowrap text-decoration-none">
              <i className="ti ti-table" />
              Full Timetable
            </Link>
            <button
              type="button"
              className="portal-button portal-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"
              onClick={onClose}
            >
              Close
            </button>
          </>
        }
      >
        <div className="portal-timeline-track position-relative">
          {TIMETABLE.map((slot) => (
            <div className={`portal-timeline ${slot.accent} position-relative`} key={slot.id}>
              <div className="portal-timeline-time text-end">{slot.time}</div>
              <div className="portal-timeline-body position-relative">
                <span className="portal-timeline-dot position-absolute" />
                <b>{slot.title}</b>
                <p>{slot.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* ---------------------------------- Pay ------------------------------- */}
      <Modal
        open={active === 'pay'}
        onClose={onClose}
        title="Pay Fees"
        titleIcon="ti ti-credit-card"
        contentClassName="parent-portal"
        formClassName="validated-form"
        onSubmit={payForm.handleSubmit}
      >
        <div className="payment-line payment-line-boxed accent-warning align-items-center position-relative">
          <span className="avatar avatar-icon avatar-34 avatar-glyph-16 avatar-accent-soft">
            <i className="ti ti-calendar-due" />
          </span>
          <div className="payment-line-info">
            <b>Term II Tuition · {child.name.split(' ')[0]}</b>
            <span>Due 25 Dec 2024</span>
          </div>
          <div className="payment-line-amount">
            <b>$2,000</b>
          </div>
        </div>

        <label className="portal-sub d-block mb-1" htmlFor="payment-method">Payment Method</label>
        <select
          className="form-select mb-2"
          id="payment-method"
          name="method"
          value={payForm.values.method}
          onChange={payForm.handleChange}
        >
          {PAYMENT_METHODS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <label className="portal-sub d-block mb-1" htmlFor="card-number">Card Number</label>
        <input
          type="text"
          className="form-control mb-2"
          inputMode="numeric"
          maxLength={19}
          placeholder="1234 5678 9012 3456"
          id="card-number"
          name="card"
          value={payForm.values.card}
          onChange={payForm.handleChange}
          onBlur={payForm.handleBlur}
        />
        {fieldError(payForm.errors.card, payForm.touched.card)}

        <div className="row g-2">
          <div className="col-6">
            <label className="portal-sub d-block mb-1" htmlFor="expiry">Expiry</label>
            <input
              type="text"
              className="form-control"
              placeholder="MM/YY"
              maxLength={5}
              id="expiry"
              name="expiry"
              value={payForm.values.expiry}
              onChange={payForm.handleChange}
              onBlur={payForm.handleBlur}
            />
            {fieldError(payForm.errors.expiry, payForm.touched.expiry)}
          </div>
          <div className="col-6">
            <label className="portal-sub d-block mb-1" htmlFor="cvv">CVV</label>
            <input
              type="password"
              autoComplete="current-password"
              className="form-control"
              maxLength={4}
              placeholder="•••"
              id="cvv"
              name="cvv"
              value={payForm.values.cvv}
              onChange={payForm.handleChange}
              onBlur={payForm.handleBlur}
            />
            {fieldError(payForm.errors.cvv, payForm.touched.cvv)}
          </div>
        </div>

        <div className="portal-sub mt-2">
          <i className="ti ti-lock-check me-1" />
          256-bit SSL encrypted · PCI-DSS
        </div>

        <button
          type="submit"
          className="portal-button portal-button-primary w-100 mt-3 form-submit d-inline-flex align-items-center text-nowrap text-decoration-none justify-content-center"
        >
          Pay $2,000
        </button>
      </Modal>

      {/* -------------------------------- Message ----------------------------- */}
      <Modal
        open={active === 'message'}
        onClose={onClose}
        title="Message Teacher"
        titleIcon="ti ti-message"
        contentClassName="parent-portal"
        formClassName="validated-form"
        onSubmit={messageForm.handleSubmit}
      >
        <label className="portal-sub d-block mb-1" htmlFor="to">To</label>
        <select
          className="form-select mb-2"
          id="to"
          name="to"
          value={messageForm.values.to}
          onChange={messageForm.handleChange}
        >
          {MESSAGE_RECIPIENTS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <label className="portal-sub d-block mb-1" htmlFor="subject">Subject</label>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Message subject"
          id="subject"
          name="subject"
          value={messageForm.values.subject}
          onChange={messageForm.handleChange}
          onBlur={messageForm.handleBlur}
        />
        {fieldError(messageForm.errors.subject, messageForm.touched.subject)}

        <label className="portal-sub d-block mb-1 mt-2" htmlFor="message">Message</label>
        <textarea
          className="form-control"
          rows={3}
          placeholder="Write your message…"
          id="message"
          name="message"
          value={messageForm.values.message}
          onChange={messageForm.handleChange}
          onBlur={messageForm.handleBlur}
        />
        {fieldError(messageForm.errors.message, messageForm.touched.message)}

        <div className="text-end mt-3">
          {cancelButton}
          <button type="submit" className="portal-button portal-button-primary form-submit d-inline-flex align-items-center text-nowrap text-decoration-none">
            <i className="ti ti-send" />
            Send
          </button>
        </div>
      </Modal>

      {/* -------------------------------- Meeting ----------------------------- */}
      <Modal
        open={active === 'meeting'}
        onClose={onClose}
        title="Schedule Meeting"
        titleIcon="ti ti-calendar-plus"
        contentClassName="parent-portal"
        formClassName="validated-form"
        onSubmit={meetingForm.handleSubmit}
      >
        <label className="portal-sub d-block mb-1" htmlFor="meet-with">With</label>
        <select
          className="form-select mb-2"
          id="meet-with"
          name="with"
          value={meetingForm.values.with}
          onChange={meetingForm.handleChange}
        >
          {MEETING_RECIPIENTS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <div className="row g-2">
          <div className="col-6">
            <label className="portal-sub d-block mb-1" htmlFor="meeting-date">Date</label>
            <DateField
              placeholder="Select Date"
              onChange={(dateString) =>
                meetingForm.setFieldValue('date', dateString as string)
              }
            />
            {fieldError(meetingForm.errors.date, meetingForm.touched.date)}
          </div>
          <div className="col-6">
            <label className="portal-sub d-block mb-1" htmlFor="meeting-time">Time</label>
            <input
              type="time"
              className="form-control"
              id="meeting-time"
              name="time"
              value={meetingForm.values.time}
              onChange={meetingForm.handleChange}
              onBlur={meetingForm.handleBlur}
            />
            {fieldError(meetingForm.errors.time, meetingForm.touched.time)}
          </div>
        </div>

        <label className="portal-sub d-block mb-1 mt-2" htmlFor="agenda">Agenda</label>
        <textarea
          className="form-control"
          rows={2}
          placeholder="What would you like to discuss?"
          id="agenda"
          name="agenda"
          value={meetingForm.values.agenda}
          onChange={meetingForm.handleChange}
        />

        <div className="text-end mt-3">
          {cancelButton}
          <button type="submit" className="portal-button portal-button-primary form-submit d-inline-flex align-items-center text-nowrap text-decoration-none">
            <i className="ti ti-check" />
            Request Meeting
          </button>
        </div>
      </Modal>

      {/* --------------------------------- Leave ------------------------------ */}
      <Modal
        open={active === 'leave'}
        onClose={onClose}
        title="Request Leave"
        titleIcon="ti ti-calendar-off"
        contentClassName="parent-portal"
        formClassName="validated-form"
        onSubmit={leaveForm.handleSubmit}
      >
        <label className="portal-sub d-block mb-1" htmlFor="leave-type">Leave Type</label>
        <select
          className="form-select mb-2"
          id="leave-type"
          name="type"
          value={leaveForm.values.type}
          onChange={leaveForm.handleChange}
        >
          {LEAVE_TYPES.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <div className="row g-2">
          <div className="col-6">
            <label className="portal-sub d-block mb-1" htmlFor="leave-from">From</label>
            <DateField
              placeholder="Select Date"
              onChange={(dateString) =>
                leaveForm.setFieldValue('from', dateString as string)
              }
            />
            {fieldError(leaveForm.errors.from, leaveForm.touched.from)}
          </div>
          <div className="col-6">
            <label className="portal-sub d-block mb-1" htmlFor="leave-to">To</label>
            <DateField
              placeholder="Select Date"
              onChange={(dateString) => leaveForm.setFieldValue('to', dateString as string)}
            />
            {fieldError(leaveForm.errors.to, leaveForm.touched.to)}
          </div>
        </div>

        <label className="portal-sub d-block mb-1 mt-2" htmlFor="leave-reason">Reason</label>
        <textarea
          className="form-control"
          rows={2}
          placeholder="Reason for leave…"
          id="leave-reason"
          name="reason"
          value={leaveForm.values.reason}
          onChange={leaveForm.handleChange}
          onBlur={leaveForm.handleBlur}
        />
        {fieldError(leaveForm.errors.reason, leaveForm.touched.reason)}

        <div className="text-end mt-3">
          {cancelButton}
          <button type="submit" className="portal-button portal-button-primary form-submit d-inline-flex align-items-center text-nowrap text-decoration-none">
            <i className="ti ti-send" />
            Submit
          </button>
        </div>
      </Modal>

      {/* ------------------------------ Edit parent --------------------------- */}
      <Modal
        open={active === 'editParent'}
        onClose={onClose}
        title="Edit Parent"
        onSubmit={parentForm.handleSubmit}
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
        <div className="row">
          <div className="col-md-12">
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
              <label className="form-label" htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                id="name"
                name="name"
                value={parentForm.values.name}
                onChange={parentForm.handleChange}
                onBlur={parentForm.handleBlur}
              />
              {fieldError(parentForm.errors.name, parentForm.touched.name)}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="phone-number">Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Phone Number"
                id="phone-number"
                name="phone"
                value={parentForm.values.phone}
                onChange={parentForm.handleChange}
                onBlur={parentForm.handleBlur}
              />
              {fieldError(parentForm.errors.phone, parentForm.touched.phone)}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="email-address">Email Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Email Address"
                id="email-address"
                name="email"
                value={parentForm.values.email}
                onChange={parentForm.handleChange}
                onBlur={parentForm.handleBlur}
              />
              {fieldError(parentForm.errors.email, parentForm.touched.email)}
            </div>

            <div className="mb-0">
              <label className="form-label" htmlFor="child">Child</label>
              {/* `select2 multiple` in the template. */}
              <MultiSelect
                inputId="child"
                className="select select2"
                options={CHILD_OPTIONS}
                value={parentForm.values.children}
                onChange={(values) => parentForm.setFieldValue('children', values)}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ParentModals;
