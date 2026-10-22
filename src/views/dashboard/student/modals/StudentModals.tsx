import DateField from '@components/ui/DateField';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useForm } from '@hooks/useForm';
import { required } from '@utils/validation';
import InfoListRow from '../../shared/InfoListRow';
import type { StudentModalId } from '../data/studentDashboard.data';
import { studentProfile } from '../data/studentDashboard.data';
import {
  assignmentOptions,
  busCrew,
  busStops,
  classNotes,
  feedbackComments,
  goalTypes,
  idCardDetails,
  issuedBooks,
  joinDetails,
  leaveTypes,
  meetingRecipients,
  meetingSlots,
  messageRecipients,
  paymentMethods,
  pendingAssignments,
  recommendedBooks,
  recordedLessons,
  renewBook,
  renewDetails,
  resultSubjects,
  resultTiles,
  timetableLessons,
} from '../data/studentModals.data';

const routes = all_routes;

export interface StudentModalsProps {
  active: StudentModalId | null;
  onClose: () => void;
  onOpen: (modal: StudentModalId) => void;
}

const StudentModals = ({ active, onClose, onOpen }: StudentModalsProps) => {
  const fieldError = (message?: string, touched?: boolean) =>
    touched && message ? (
      <span className="text-danger fs-12 d-block mt-1">{message}</span>
    ) : null;

  /* ------------------------------ Assignment form --------------------------- */
  const assignForm = useForm<{ assignment: string; note: string }, void>({
    initialValues: { assignment: '', note: '' },
    validationSchema: { assignment: required('Select an assignment') },
    onSubmit: async () => undefined,
    onSuccess: () => {
      assignForm.reset();
      onClose();
    },
  });

  /* --------------------------------- Pay form ------------------------------- */
  const payForm = useForm<
    { method: string; card: string; expiry: string; cvv: string },
    void
  >({
    initialValues: { method: paymentMethods[0], card: '', expiry: '', cvv: '' },
    validationSchema: {
      card: required('Card number is required'),
      expiry: required('Expiry is required'),
      cvv: required('CVV is required'),
    },
    onSubmit: async () => undefined,
    onSuccess: () => {
      payForm.reset();
      onClose();
    },
  });

  /* ------------------------------- Message form ----------------------------- */
  const messageForm = useForm<{ to: string; subject: string; message: string }, void>({
    initialValues: { to: messageRecipients[0], subject: '', message: '' },
    validationSchema: {
      subject: required('Subject is required'),
      message: required('Message is required'),
    },
    onSubmit: async () => undefined,
    onSuccess: () => {
      messageForm.reset();
      onClose();
    },
  });

  /* -------------------------------- Leave form ------------------------------ */
  const leaveForm = useForm<
    { type: string; from: string; to: string; reason: string },
    void
  >({
    initialValues: { type: leaveTypes[0], from: '', to: '', reason: '' },
    validationSchema: {
      from: required('Choose a start date'),
      to: required('Choose an end date'),
      reason: required('Reason is required'),
    },
    onSubmit: async () => undefined,
    onSuccess: () => {
      leaveForm.reset();
      onClose();
    },
  });

  /* --------------------------------- Goal form ------------------------------ */
  const goalForm = useForm<
    { type: string; title: string; target: string; date: string; why: string },
    void
  >({
    initialValues: { type: goalTypes[0], title: '', target: '', date: '', why: '' },
    validationSchema: {
      title: required('Goal title is required'),
      target: required('Target value is required'),
      date: required('Choose a target date'),
    },
    onSubmit: async () => undefined,
    onSuccess: () => {
      goalForm.reset();
      onClose();
    },
  });

  /* ------------------------------- Meeting form ----------------------------- */
  const meetingForm = useForm<
    { with: string; date: string; time: string; topic: string },
    void
  >({
    initialValues: { with: meetingRecipients[0], date: '', time: '', topic: '' },
    validationSchema: {
      date: required('Choose a date'),
      time: required('Choose a time'),
      topic: required('Describe the topic'),
    },
    onSubmit: async () => undefined,
    onSuccess: () => {
      meetingForm.reset();
      onClose();
    },
  });

  const closeBtn = (
    <button type="button" className="btn btn-primary" onClick={onClose}>
      Close
    </button>
  );

  return (
    <>
      {/* ------------------------------- Timetable ---------------------------- */}
      <Modal
        open={active === 'timetable'}
        onClose={onClose}
        title="Today's Timetable"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <>
            <Link to={routes.classTimetable} className="btn btn-light">
              <i className="ti ti-table me-1" />
              Full Timetable
            </Link>
            {closeBtn}
          </>
        }
      >
        <div className="lesson-list d-flex flex-column">
          {timetableLessons.map((lesson) => (
            <div className={`lesson-item ${lesson.borderClass} align-items-center`} key={lesson.id}>
              <div className="lesson-time text-center">
                <b>{lesson.time}</b>
                <span>{lesson.duration}</span>
              </div>
              <div className="lesson-body">
                <b>{lesson.subject}</b>
                <div className="lesson-tags d-flex align-items-center flex-wrap">
                  <span className="lesson-tag d-inline-flex align-items-center">
                    <i className="ti ti-user" />
                    {lesson.teacher}
                  </span>
                  <span className="lesson-tag d-inline-flex align-items-center">
                    <i className="ti ti-door" />
                    {lesson.room}
                  </span>
                </div>
              </div>
              <div className="lesson-actions d-flex align-items-center">
                <span className={lesson.status.className}>
                  {lesson.status.icon ? <i className={`${lesson.status.icon} me-1`} /> : null}
                  {lesson.status.label}
                </span>
                {lesson.live ? (
                  <button
                    type="button"
                    className="action-button action-button-sm action-button-success d-inline-flex align-items-center text-nowrap text-decoration-none"
                    onClick={() => onOpen('join')}
                  >
                    <i className="ti ti-video" />
                    Join
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* ------------------------------ Submit work --------------------------- */}
      <Modal
        open={active === 'assign'}
        onClose={onClose}
        title="Submit Assignment"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <>
            <Link to={routes.classHomeWork} className="btn btn-light">
              <i className="ti ti-external-link me-1" />
              Homework Page
            </Link>
            {closeBtn}
          </>
        }
      >
        <form className="mb-3" noValidate onSubmit={assignForm.handleSubmit}>
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label" htmlFor="assignment">Assignment</label>
              <select
                className="form-select"
                id="assignment"
                name="assignment"
                value={assignForm.values.assignment}
                onChange={assignForm.handleChange}
                onBlur={assignForm.handleBlur}
              >
                <option value="">Select</option>
                {assignmentOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              {fieldError(assignForm.errors.assignment, assignForm.touched.assignment)}
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="upload-file">Upload File</label>
              <input type="file" className="form-control" id="upload-file" />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="note-to-teacher">
                Note to teacher (optional)
              </label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Add a note…"
                id="note-to-teacher"
                name="note"
                value={assignForm.values.note}
                onChange={assignForm.handleChange}
              />
            </div>
          </div>
          <div className="text-end mt-2">
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-check me-1" />
              Submit Assignment
            </button>
          </div>
        </form>

        <h5 className="widget-subtitle mb-2 fs-15">
          <i className="ti ti-list-check me-1" />
          Pending Assignments
        </h5>
        <div className="info-list d-flex flex-column">
          {pendingAssignments.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>
      </Modal>

      {/* -------------------------------- Results ----------------------------- */}
      <Modal
        open={active === 'results'}
        onClose={onClose}
        title="Exam Results"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <>
            <Link to={routes.examResult} className="btn btn-light">
              <i className="ti ti-download me-1" />
              Marksheet
            </Link>
            {closeBtn}
          </>
        }
      >
        <div className="row g-2 mb-3">
          {resultTiles.map((tile) => (
            <div className="col-4" key={tile.id}>
              <div className={`metric-tile metric-tile-md ${tile.borderClass}`}>
                <div className="metric-tile-value">{tile.value}</div>
                <div className="metric-tile-label">{tile.label}</div>
              </div>
            </div>
          ))}
        </div>

        <h5 className="widget-subtitle mb-2 fs-15">
          <i className="ti ti-list-numbers me-1" />
          Subject-wise Marks
        </h5>
        <div className="subject-list mb-3">
          {resultSubjects.map((subject) => (
            <div className="subject-item subject-item-compact" key={subject.id}>
              <span className="nm">{subject.name}</span>
              <div className="progress progress-sm">
                <div className={`progress-bar ${subject.barClass}`} style={{ width: subject.width }} />
              </div>
              <span className="pc">{subject.percent}</span>
              <span className={`gr ${subject.gradeClass}`}>{subject.grade}</span>
            </div>
          ))}
        </div>
      </Modal>

      {/* ---------------------------------- Pay ------------------------------- */}
      <Modal
        open={active === 'pay'}
        onClose={onClose}
        title="Pay Fees"
        onSubmit={payForm.handleSubmit}
        footer={
          <button type="submit" className="btn btn-primary w-100">
            Pay $2,000
          </button>
        }
      >
        <div className="info-list-item mb-3 bg-body-tertiary d-flex align-items-center">
          <span className="info-list-icon bg-body-secondary text-body-secondary flex-shrink-0">
            <i className="ti ti-calendar-due" />
          </span>
          <div className="info-list-body">
            <b>Term II Tuition</b>
            <span>Due 25 Dec 2024</span>
          </div>
          <div className="info-list-end flex-shrink-0 text-end">
            <b className="amount-value">$2,000</b>
          </div>
        </div>

        <label className="form-label" htmlFor="payment-method">Payment Method</label>
        <select
          className="form-select mb-2"
          id="payment-method"
          name="method"
          value={payForm.values.method}
          onChange={payForm.handleChange}
        >
          {paymentMethods.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <label className="form-label" htmlFor="card-number">Card Number</label>
        <input
          type="text"
          className="form-control mb-1"
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

        <div className="row g-2 mt-1">
          <div className="col-6">
            <label className="form-label" htmlFor="expiry">Expiry</label>
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
            <label className="form-label" htmlFor="cvv">CVV</label>
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

        <div className="widget-subtitle mt-2">
          <i className="ti ti-lock-check me-1" />
          256-bit SSL encrypted payment
        </div>
      </Modal>

      {/* -------------------------------- Message ----------------------------- */}
      <Modal
        open={active === 'message'}
        onClose={onClose}
        title="Message Teacher"
        onSubmit={messageForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-1" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-send me-1" />
              Send
            </button>
          </>
        }
      >
        <label className="form-label" htmlFor="to">To</label>
        <select
          className="form-select mb-2"
          id="to"
          name="to"
          value={messageForm.values.to}
          onChange={messageForm.handleChange}
        >
          {messageRecipients.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <label className="form-label" htmlFor="subject">Subject</label>
        <input
          type="text"
          className="form-control mb-1"
          placeholder="Message subject"
          id="subject"
          name="subject"
          value={messageForm.values.subject}
          onChange={messageForm.handleChange}
          onBlur={messageForm.handleBlur}
        />
        {fieldError(messageForm.errors.subject, messageForm.touched.subject)}

        <label className="form-label mt-2" htmlFor="message">Message</label>
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
      </Modal>

      {/* --------------------------------- Leave ------------------------------ */}
      <Modal
        open={active === 'leave'}
        onClose={onClose}
        title="Request Leave"
        onSubmit={leaveForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-1" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-send me-1" />
              Submit Request
            </button>
          </>
        }
      >
        <label className="form-label" htmlFor="leave-type">Leave Type</label>
        <select
          className="form-select mb-2"
          id="leave-type"
          name="type"
          value={leaveForm.values.type}
          onChange={leaveForm.handleChange}
        >
          {leaveTypes.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <div className="row g-2">
          <div className="col-6">
            <label className="form-label" htmlFor="leave-from">From</label>
            <DateField
              placeholder="Select Date"
              onChange={(dateString) =>
                leaveForm.setFieldValue('from', dateString as string)
              }
            />
            {fieldError(leaveForm.errors.from, leaveForm.touched.from)}
          </div>
          <div className="col-6">
            <label className="form-label" htmlFor="leave-to">To</label>
            <DateField
              placeholder="Select Date"
              onChange={(dateString) => leaveForm.setFieldValue('to', dateString as string)}
            />
            {fieldError(leaveForm.errors.to, leaveForm.touched.to)}
          </div>
        </div>

        <label className="form-label mt-2" htmlFor="reason">Reason</label>
        <textarea
          className="form-control"
          rows={2}
          placeholder="Reason for leave…"
          id="reason"
          name="reason"
          value={leaveForm.values.reason}
          onChange={leaveForm.handleChange}
          onBlur={leaveForm.handleBlur}
        />
        {fieldError(leaveForm.errors.reason, leaveForm.touched.reason)}
      </Modal>

      {/* ---------------------------------- Join ------------------------------ */}
      <Modal
        open={active === 'join'}
        onClose={onClose}
        title="Join Live Class"
        footer={
          <>
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              <i className="ti ti-video me-1" />
              Join Now
            </button>
          </>
        }
      >
        <div className="countdown-strip border-danger bg-danger-transparent mb-3">
          <span className="ic bg-white text-danger">
            <i className="ti ti-video" />
          </span>
          <div className="tx">
            <b>Science — Physics</b>
            <span>Mr. John Doe · Lab 02</span>
          </div>
          <div className="num text-danger">
            <b>LIVE</b>
            <span>in progress</span>
          </div>
        </div>

        <div className="info-list d-flex flex-column">
          {joinDetails.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>
      </Modal>

      {/* --------------------------------- Notes ------------------------------ */}
      <Modal
        open={active === 'notes'}
        onClose={onClose}
        title="Class Notes & Materials"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <>
            <button type="button" className="btn btn-light" onClick={onClose}>
              Close
            </button>
            <Link to={routes.classHomeWork} className="btn btn-primary">
              <i className="ti ti-download me-1" />
              Download All
            </Link>
          </>
        }
      >
        <h5 className="widget-subtitle mb-2 fs-15">
          <i className="ti ti-file-text me-1" />
          Today&apos;s Notes
        </h5>
        <div className="info-list mb-3 d-flex flex-column">
          {classNotes.map((row) => (
            <InfoListRow
              row={row}
              key={row.id}
              endSlot={
                <Link
                  to={routes.classHomeWork}
                  className="icon-action d-inline-flex align-items-center justify-content-center text-decoration-none"
                  title="Download"
                >
                  <i className="ti ti-download" />
                </Link>
              }
            />
          ))}
        </div>

        <h6 className="widget-subtitle mb-2">
          <i className="ti ti-video me-1" />
          Recorded Lessons
        </h6>
        <div className="info-list d-flex flex-column">
          {recordedLessons.map((row) => (
            <InfoListRow
              row={row}
              key={row.id}
              endSlot={
                <Link
                  to={routes.classHomeWork}
                  className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
                >
                  Watch
                </Link>
              }
            />
          ))}
        </div>
      </Modal>

      {/* -------------------------------- Feedback ---------------------------- */}
      <Modal
        open={active === 'feedback'}
        onClose={onClose}
        title="Teacher Feedback"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <>
            <button type="button" className="btn btn-light" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('message')}>
              <i className="ti ti-message me-1" />
              Reply to Teacher
            </button>
          </>
        }
      >
        <h5 className="widget-subtitle mb-2 fs-15">
          <i className="ti ti-checklist me-1" />
          Skill Breakdown
        </h5>
        <div className="subject-list mb-3">
          {resultSubjects.map((subject) => (
            <div className="subject-item subject-item-compact" key={subject.id}>
              <span className="nm">{subject.name}</span>
              <div className="progress progress-sm">
                <div className={`progress-bar ${subject.barClass}`} style={{ width: subject.width }} />
              </div>
              <span className="pc">{subject.percent}</span>
              <span className={`gr ${subject.gradeClass}`}>{subject.grade}</span>
            </div>
          ))}
        </div>

        <h6 className="widget-subtitle mb-2">
          <i className="ti ti-messages me-1" />
          Comments
        </h6>
        <div className="info-list d-flex flex-column">
          {feedbackComments.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>
      </Modal>

      {/* ---------------------------------- Goal ------------------------------ */}
      <Modal
        open={active === 'goal'}
        onClose={onClose}
        title="Set a New Goal"
        onSubmit={goalForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-1" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-check me-1" />
              Create Goal
            </button>
          </>
        }
      >
        <label className="form-label" htmlFor="goal-type">Goal Type</label>
        <select
          className="form-select mb-2"
          id="goal-type"
          name="type"
          value={goalForm.values.type}
          onChange={goalForm.handleChange}
        >
          {goalTypes.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <label className="form-label" htmlFor="goal-title">Goal Title</label>
        <input
          type="text"
          className="form-control mb-1"
          placeholder="e.g. Lift English above 75%"
          id="goal-title"
          name="title"
          value={goalForm.values.title}
          onChange={goalForm.handleChange}
          onBlur={goalForm.handleBlur}
        />
        {fieldError(goalForm.errors.title, goalForm.touched.title)}

        <div className="row g-2 mt-1">
          <div className="col-6">
            <label className="form-label" htmlFor="target-value">Target Value</label>
            <input
              type="text"
              className="form-control"
              placeholder="75%"
              id="target-value"
              name="target"
              value={goalForm.values.target}
              onChange={goalForm.handleChange}
              onBlur={goalForm.handleBlur}
            />
            {fieldError(goalForm.errors.target, goalForm.touched.target)}
          </div>
          <div className="col-6">
            <label className="form-label" htmlFor="target-date">Target Date</label>
            <DateField
              placeholder="Select Date"
              onChange={(dateString) =>
                goalForm.setFieldValue('date', dateString as string)
              }
            />
            {fieldError(goalForm.errors.date, goalForm.touched.date)}
          </div>
        </div>

        <label className="form-label mt-2" htmlFor="why-this-goal">Why this goal?</label>
        <textarea
          className="form-control"
          rows={2}
          placeholder="A short note to keep you motivated…"
          id="why-this-goal"
          name="why"
          value={goalForm.values.why}
          onChange={goalForm.handleChange}
        />
      </Modal>

      {/* -------------------------------- Meeting ----------------------------- */}
      <Modal
        open={active === 'meeting'}
        onClose={onClose}
        title="Schedule a Meeting"
        dialogClassName="modal-lg modal-dialog-scrollable"
        onSubmit={meetingForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-1" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-send me-1" />
              Request Meeting
            </button>
          </>
        }
      >
        <label className="form-label" htmlFor="meet-with">Meet With</label>
        <select
          className="form-select mb-2"
          id="meet-with"
          name="with"
          value={meetingForm.values.with}
          onChange={meetingForm.handleChange}
        >
          {meetingRecipients.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <label className="form-label">Available Slots</label>
        <div className="info-list mb-2 d-flex flex-column">
          {meetingSlots.map((row) => (
            <InfoListRow row={row} key={row.id} small />
          ))}
        </div>

        <div className="row g-2">
          <div className="col-6">
            <label className="form-label" htmlFor="meeting-date">Date</label>
            <DateField
              placeholder="Select Date"
              onChange={(dateString) =>
                meetingForm.setFieldValue('date', dateString as string)
              }
            />
            {fieldError(meetingForm.errors.date, meetingForm.touched.date)}
          </div>
          <div className="col-6">
            <label className="form-label" htmlFor="meeting-time">Time</label>
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

        <label className="form-label mt-2" htmlFor="meeting-topic">
          What would you like to discuss?
        </label>
        <textarea
          className="form-control"
          rows={2}
          placeholder="Briefly describe the topic…"
          id="meeting-topic"
          name="topic"
          value={meetingForm.values.topic}
          onChange={meetingForm.handleChange}
          onBlur={meetingForm.handleBlur}
        />
        {fieldError(meetingForm.errors.topic, meetingForm.touched.topic)}
      </Modal>

      {/* --------------------------------- Renew ------------------------------ */}
      <Modal
        open={active === 'renew'}
        onClose={onClose}
        title="Renew Book"
        footer={
          <>
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              <i className="ti ti-check me-1" />
              Confirm Renewal
            </button>
          </>
        }
      >
        <div className="mb-3">
          <InfoListRow row={renewBook} />
        </div>
        <div className="info-list d-flex flex-column">
          {renewDetails.map((row) => (
            <InfoListRow row={row} key={row.id} small />
          ))}
        </div>
      </Modal>

      {/* --------------------------------- Track ------------------------------ */}
      <Modal
        open={active === 'track'}
        onClose={onClose}
        title="Live Bus Tracking"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={closeBtn}
      >
        <div className="countdown-strip border-primary bg-primary-transparent mb-3">
          <span className="ic bg-white text-primary">
            <i className="ti ti-bus" />
          </span>
          <div className="tx">
            <b>BUS-04 · Route 12</b>
            <span>Downtown loop · 28 students on board</span>
          </div>
        </div>

        <h5 className="widget-subtitle mb-2 fs-15">
          <i className="ti ti-map-pin me-1" />
          Stop Schedule
        </h5>
        <div className="timeline-list position-relative mb-3">
          {busStops.map((stop) => (
            <div className="timeline-item d-flex position-relative" key={stop.id}>
              <span className={`timeline-icon ${stop.iconClass}`}>
                <i className={stop.icon} />
              </span>
              <div className="timeline-body">
                <b>{stop.title}</b>
                <p>{stop.detail}</p>
              </div>
              <span className="timeline-time ms-auto">{stop.time}</span>
            </div>
          ))}
        </div>

        <h6 className="widget-subtitle mb-2">
          <i className="ti ti-users me-1" />
          Bus Crew
        </h6>
        <div className="info-list d-flex flex-column">
          {busCrew.map((row) => (
            <InfoListRow
              row={row}
              key={row.id}
              endSlot={
                <a
                  href="tel:+14587331"
                  className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
                >
                  <i className="ti ti-phone" />
                  Call
                </a>
              }
            />
          ))}
        </div>
      </Modal>

      {/* -------------------------------- Library ----------------------------- */}
      <Modal
        open={active === 'library'}
        onClose={onClose}
        title="My Library"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <Link to={routes.libraryBooks} className="btn btn-primary">
            <i className="ti ti-books me-1" />
            Browse Library
          </Link>
        }
      >
        <h5 className="widget-subtitle mb-2 fs-15">
          <i className="ti ti-book-2 me-1" />
          Issued Books
        </h5>
        <div className="info-list mb-3 d-flex flex-column">
          {issuedBooks.map((row) => (
            <InfoListRow
              row={row}
              key={row.id}
              endSlot={
                row.id === 'ib1' ? (
                  <button
                    type="button"
                    className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
                    onClick={() => onOpen('renew')}
                  >
                    Renew
                  </button>
                ) : undefined
              }
            />
          ))}
        </div>

        <h6 className="widget-subtitle mb-2">
          <i className="ti ti-star me-1" />
          Recommended for You
        </h6>
        <div className="info-list d-flex flex-column">
          {recommendedBooks.map((row) => (
            <InfoListRow
              row={row}
              key={row.id}
              endSlot={
                <Link
                  to={routes.libraryBooks}
                  className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
                >
                  Reserve
                </Link>
              }
            />
          ))}
        </div>
      </Modal>

      {/* -------------------------------- ID card ----------------------------- */}
      <Modal
        open={active === 'idcard'}
        onClose={onClose}
        title="Student ID Card"
        footer={closeBtn}
      >
        <div className="d-flex align-items-center gap-3 mb-3">
          <ImageWithBasePath
            src={studentProfile.photo}
            alt={studentProfile.name}
            className="rounded object-fit-cover"
          />
          <div>
            <b>{studentProfile.name}</b>
            <div className="id-card-class">Class III-A · Roll 35013</div>
            <div className="org">KARKAII ACADEMY</div>
          </div>
        </div>

        <div className="info-list d-flex flex-column">
          {idCardDetails.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>
      </Modal>

      {/* ----------------------------- Exam schedule -------------------------- */}
      <Modal
        open={active === 'examSchedule'}
        onClose={onClose}
        title="Add Exam Schedule"
        footer={closeBtn}
      >
        <div className="info-list d-flex flex-column">
          {resultTiles.map((tile) => (
            <div className={`metric-tile metric-tile-md ${tile.borderClass} mb-2`} key={tile.id}>
              <div className="metric-tile-value">{tile.value}</div>
              <div className="metric-tile-label">{tile.label}</div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default StudentModals;
