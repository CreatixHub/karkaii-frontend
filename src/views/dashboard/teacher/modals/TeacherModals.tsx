import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useForm } from '@hooks/useForm';
import { required } from '@utils/validation';
import type { TeacherModalId } from '../data/teacherDashboard.data';
import {
  notifications as notificationRows,
  teacherProfile,
  todaysLessons,
} from '../data/teacherDashboard.data';
import {
  announcementAudiences,
  attendanceTotals,
  classWiseAttendance,
  examSchedule,
  homeworkClasses,
  homeworkPending,
  lateAndLeave,
  modalMessages,
  performanceAtRisk,
  performanceTopPerformers,
  performanceTotals,
  profileDetails,
  quickActionTiles,
  upcomingMeetings,
} from '../data/teacherModals.data';
import InfoListRow from '../../shared/InfoListRow';
import QuickAttendanceModal from './QuickAttendanceModal';

const routes = all_routes;

export interface TeacherModalsProps {
  active: TeacherModalId | null;
  onClose: () => void;
  onOpen: (modal: TeacherModalId) => void;
  onToast: (message: string) => void;
}

const closeButton = (onClose: () => void, label = 'Close') => (
  <button
    type="button"
    className="action-button action-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"
    onClick={onClose}
  >
    {label}
  </button>
);

const TeacherModals = ({ active, onClose, onOpen, onToast }: TeacherModalsProps) => {
  const [notificationsRead, setNotificationsRead] = useState(false);

  /* ------------------------------- Homework form ------------------------------ */
  const homeworkForm = useForm<
    { title: string; className: string; dueDate: string; instructions: string },
    string
  >({
    initialValues: { title: '', className: '', dueDate: '', instructions: '' },
    validationSchema: {
      title: required('Title is required'),
      className: required('Select a class'),
      dueDate: required('Choose a due date'),
    },
    onSubmit: async () => 'Assignment created & assigned.',
    onSuccess: (message) => {
      onToast(message);
      homeworkForm.reset();
      onClose();
    },
  });

  /* -------------------------------- Meeting form ------------------------------ */
  const meetingForm = useForm<{ title: string; date: string; time: string }, string>({
    initialValues: { title: '', date: '', time: '' },
    validationSchema: {
      title: required('Title is required'),
      date: required('Choose a date'),
      time: required('Choose a time'),
    },
    onSubmit: async () => 'Meeting scheduled successfully.',
    onSuccess: (message) => {
      onToast(message);
      meetingForm.reset();
      onClose();
    },
  });

  /* ------------------------------- Reply form --------------------------------- */
  const replyForm = useForm<{ reply: string }, string>({
    initialValues: { reply: '' },
    validationSchema: { reply: required('Enter a reply') },
    onSubmit: async () => 'Reply sent to parent.',
    onSuccess: (message) => {
      onToast(message);
      replyForm.reset();
    },
  });

  /* ---------------------------- Announcement form ----------------------------- */
  const announcementForm = useForm<
    { audience: string; title: string; message: string },
    string
  >({
    initialValues: { audience: announcementAudiences[0], title: '', message: '' },
    validationSchema: {
      title: required('Title is required'),
      message: required('Message is required'),
    },
    onSubmit: async () => 'Announcement sent successfully.',
    onSuccess: (message) => {
      onToast(message);
      announcementForm.reset();
      onClose();
    },
  });

  const fieldError = (message: string | undefined, touched: boolean | undefined) =>
    touched && message ? (
      <span className="text-danger fs-12 d-block mt-1">{message}</span>
    ) : null;

  return (
    <>
      <QuickAttendanceModal
        open={active === 'quickAttendance'}
        onClose={onClose}
        onSaved={onToast}
      />

      {/* ------------------------------ Today's Classes ----------------------- */}
      <Modal
        open={active === 'classes'}
        onClose={onClose}
        title="Today's Classes"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <>
            <Link
              to={routes.classTimetable}
              className="action-button d-inline-flex align-items-center text-nowrap text-decoration-none"
            >
              <i className="ti ti-table" />
              Full Timetable
            </Link>
            {closeButton(onClose)}
          </>
        }
      >
        <div className="lesson-list d-flex flex-column">
          {todaysLessons.map((lesson) => (
            <div className={`lesson-item ${lesson.borderClass} align-items-center`} key={lesson.id}>
              <div className="lesson-time text-center">
                <b>{lesson.time}</b>
                <span>{lesson.duration}</span>
              </div>
              <div className="lesson-body">
                <b>{lesson.subject}</b>
                <div className="lesson-tags d-flex align-items-center flex-wrap">
                  <span className="lesson-tag d-inline-flex align-items-center">
                    <i className="ti ti-users" />
                    {lesson.grade}
                  </span>
                  <span className="lesson-tag d-inline-flex align-items-center">
                    <i className="ti ti-door" />
                    {lesson.room}
                  </span>
                  <span className="lesson-tag d-inline-flex align-items-center">
                    <i className="ti ti-user" />
                    {lesson.students.replace(' students', '')}
                  </span>
                </div>
              </div>
              <div className="lesson-actions d-flex align-items-center">
                <span className={lesson.status.className}>
                  {lesson.status.icon ? <i className={lesson.status.icon} /> : null}
                  {lesson.status.label}
                </span>
                {lesson.status.label === 'Live' ? (
                  <button
                    type="button"
                    className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
                    onClick={() => onOpen('quickAttendance')}
                  >
                    <i className="ti ti-clipboard-check" />
                    Attendance
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* --------------------------- Attendance Summary ----------------------- */}
      <Modal
        open={active === 'attendance'}
        onClose={onClose}
        title="Attendance Summary"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <>
            <button
              type="button"
              className="action-button d-inline-flex align-items-center text-nowrap text-decoration-none"
              onClick={() => onOpen('quickAttendance')}
            >
              <i className="ti ti-clipboard-check" />
              Take Attendance
            </button>
            {closeButton(onClose)}
          </>
        }
      >
        <div className="row g-2 mb-3">
          {attendanceTotals.map((total) => (
            <div className="col-4" key={total.id}>
              <div className="card p-2 mb-0 text-center">
                <div className="fs-22 fw-bold text-dark">{total.value}</div>
                <div className="fs-11 text-muted">{total.label}</div>
              </div>
            </div>
          ))}
        </div>

        <h5 className="widget-subtitle mb-2">
          <i className="ti ti-users me-1" />
          Class-wise Attendance
        </h5>
        <div className="info-list mb-3 d-flex flex-column">
          {classWiseAttendance.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>

        <h6 className="widget-subtitle mb-2">
          <i className="ti ti-clock-exclamation me-1" />
          Late &amp; Leave
        </h6>
        <div className="info-list d-flex flex-column">
          {lateAndLeave.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>
      </Modal>

      {/* ------------------------------- Homework ----------------------------- */}
      <Modal
        open={active === 'homework'}
        onClose={onClose}
        title="Homework & Assignments"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <>
            <Link
              to={routes.classHomeWork}
              className="action-button d-inline-flex align-items-center text-nowrap text-decoration-none"
            >
              <i className="ti ti-book" />
              Homework Page
            </Link>
            {closeButton(onClose)}
          </>
        }
      >
        <h5 className="widget-subtitle mb-2">
          <i className="ti ti-file-plus me-1" />
          Create New Assignment
        </h5>
        <form noValidate onSubmit={homeworkForm.handleSubmit} className="mb-3">
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label" htmlFor="hw-title">Title</label>
              <input
                type="text"
                className="form-control"
                id="hw-title"
                name="title"
                placeholder="e.g. Algebra Worksheet 5"
                value={homeworkForm.values.title}
                onChange={homeworkForm.handleChange}
                onBlur={homeworkForm.handleBlur}
              />
              {fieldError(homeworkForm.errors.title, homeworkForm.touched.title)}
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="hw-class">Class</label>
              <select
                className="form-select"
                id="hw-class"
                name="className"
                value={homeworkForm.values.className}
                onChange={homeworkForm.handleChange}
                onBlur={homeworkForm.handleBlur}
              >
                <option value="">Select</option>
                {homeworkClasses.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              {fieldError(homeworkForm.errors.className, homeworkForm.touched.className)}
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="hw-due">Due Date</label>
              <input
                type="date"
                className="form-control"
                id="hw-due"
                name="dueDate"
                value={homeworkForm.values.dueDate}
                onChange={homeworkForm.handleChange}
                onBlur={homeworkForm.handleBlur}
              />
              {fieldError(homeworkForm.errors.dueDate, homeworkForm.touched.dueDate)}
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="hw-instructions">Instructions</label>
              <textarea
                className="form-control"
                rows={2}
                id="hw-instructions"
                name="instructions"
                placeholder="Describe the assignment…"
                value={homeworkForm.values.instructions}
                onChange={homeworkForm.handleChange}
              />
            </div>
          </div>
          <div className="mt-2">
            <button
              type="submit"
              className="action-button action-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"
            >
              <i className="ti ti-plus" />
              Create Assignment
            </button>
          </div>
        </form>

        <h6 className="widget-subtitle mb-2">
          <i className="ti ti-clipboard-list me-1" />
          Pending Review
        </h6>
        <div className="info-list d-flex flex-column">
          {homeworkPending.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>
      </Modal>

      {/* -------------------------------- Exams ------------------------------- */}
      <Modal
        open={active === 'exams'}
        onClose={onClose}
        title="Upcoming Exams"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <>
            <Link
              to={routes.examSchedule}
              className="action-button d-inline-flex align-items-center text-nowrap text-decoration-none"
            >
              <i className="ti ti-calendar" />
              Exam Schedule
            </Link>
            <Link
              to={routes.examResult}
              className="action-button action-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"
            >
              <i className="ti ti-writing" />
              Enter Marks
            </Link>
          </>
        }
      >
        <div className="info-list d-flex flex-column">
          {examSchedule.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>
      </Modal>

      {/* ------------------------------ Performance --------------------------- */}
      <Modal
        open={active === 'performance'}
        onClose={onClose}
        title="Student & Class Performance"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <>
            <Link
              to={routes.studentPromotion}
              className="action-button d-inline-flex align-items-center text-nowrap text-decoration-none"
            >
              <i className="ti ti-report-analytics" />
              Full Report
            </Link>
            {closeButton(onClose)}
          </>
        }
      >
        <div className="row g-2 mb-3">
          {performanceTotals.map((total) => (
            <div className="col-6 col-md-3" key={total.id}>
              <div className="card p-2 mb-0 text-center">
                <div className="fs-22 fw-bold text-dark">{total.value}</div>
                <div className="fs-11 text-muted">{total.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <h5 className="widget-subtitle mb-2">
              <i className="ti ti-star me-1 text-warning" />
              Top Performers
            </h5>
            <div className="info-list d-flex flex-column">
              {performanceTopPerformers.map((row) => (
                <InfoListRow
                  row={row}
                  key={row.id}
                  endSlot={
                    <Link to={routes.studentDetail} className="link-primary fs-13">
                      View
                    </Link>
                  }
                />
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <h6 className="widget-subtitle mb-2">
              <i className="ti ti-alert-hexagon me-1 text-danger" />
              Students at Risk
            </h6>
            <div className="info-list d-flex flex-column">
              {performanceAtRisk.map((row) => (
                <InfoListRow
                  row={row}
                  key={row.id}
                  endSlot={
                    <Link to={routes.studentDetail} className="link-primary fs-13">
                      View
                    </Link>
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* ------------------------------- Messages ----------------------------- */}
      <Modal
        open={active === 'messages'}
        onClose={onClose}
        title="Parent Messages"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <>
            <Link
              to={routes.email}
              className="action-button d-inline-flex align-items-center text-nowrap text-decoration-none"
            >
              <i className="ti ti-mail" />
              Email
            </Link>
          </>
        }
      >
        <div className="info-list mb-3 d-flex flex-column">
          {modalMessages.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>

        <form onSubmit={replyForm.handleSubmit}>
          <label className="form-label" htmlFor="quick-reply">Quick Reply</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="quick-reply"
              name="reply"
              placeholder="Type a reply…"
              value={replyForm.values.reply}
              onChange={replyForm.handleChange}
            />
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-send" />
            </button>
          </div>
        </form>
      </Modal>

      {/* ----------------------------- Notifications -------------------------- */}
      <Modal
        open={active === 'notifications'}
        onClose={onClose}
        title="Notifications"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <>
            <button
              type="button"
              className="action-button d-inline-flex align-items-center text-nowrap text-decoration-none"
              onClick={() => {
                setNotificationsRead(true);
                onToast('All notifications marked as read.');
              }}
            >
              <i className="ti ti-checks" />
              Mark all read
            </button>
            <Link
              to={routes.activity}
              className="action-button action-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"
            >
              View All Activity
            </Link>
          </>
        }
      >
        <div className={`info-list d-flex flex-column${notificationsRead ? ' opacity-75' : ''}`}>
          {notificationRows.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>
      </Modal>

      {/* ------------------------------- Events ------------------------------- */}
      <Modal
        open={active === 'events'}
        onClose={onClose}
        title="Events & Meetings"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <>
            <Link
              to={routes.calendar}
              className="action-button d-inline-flex align-items-center text-nowrap text-decoration-none"
            >
              <i className="ti ti-calendar" />
              Open Calendar
            </Link>
            {closeButton(onClose)}
          </>
        }
      >
        <h5 className="widget-subtitle mb-2">
          <i className="ti ti-calendar-plus me-1" />
          Schedule a Meeting
        </h5>
        <form noValidate onSubmit={meetingForm.handleSubmit} className="mb-3">
          <div className="row g-2">
            <div className="col-md-4">
              <label className="form-label" htmlFor="mt-title">Title</label>
              <input
                type="text"
                className="form-control"
                id="mt-title"
                name="title"
                placeholder="e.g. PTA — Grade IV"
                value={meetingForm.values.title}
                onChange={meetingForm.handleChange}
                onBlur={meetingForm.handleBlur}
              />
              {fieldError(meetingForm.errors.title, meetingForm.touched.title)}
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="mt-date">Date</label>
              <input
                type="date"
                className="form-control"
                id="mt-date"
                name="date"
                value={meetingForm.values.date}
                onChange={meetingForm.handleChange}
                onBlur={meetingForm.handleBlur}
              />
              {fieldError(meetingForm.errors.date, meetingForm.touched.date)}
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="mt-time">Time</label>
              <input
                type="time"
                className="form-control"
                id="mt-time"
                name="time"
                value={meetingForm.values.time}
                onChange={meetingForm.handleChange}
                onBlur={meetingForm.handleBlur}
              />
              {fieldError(meetingForm.errors.time, meetingForm.touched.time)}
            </div>
          </div>
          <div className="mt-2">
            <button
              type="submit"
              className="action-button action-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"
            >
              <i className="ti ti-calendar-plus" />
              Schedule
            </button>
          </div>
        </form>

        <h6 className="widget-subtitle mb-2">
          <i className="ti ti-calendar-event me-1" />
          Upcoming
        </h6>
        <div className="info-list d-flex flex-column">
          {upcomingMeetings.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>
      </Modal>

      {/* ------------------------------- Profile ------------------------------ */}
      <Modal
        open={active === 'profile'}
        onClose={onClose}
        title="Teacher Profile"
        dialogClassName="modal-lg modal-dialog-scrollable"
        footer={
          <>
            <Link
              to={routes.profilesettings}
              className="action-button d-inline-flex align-items-center text-nowrap text-decoration-none"
            >
              <i className="ti ti-edit" />
              Edit Profile
            </Link>
            <Link
              to={routes.profile}
              className="action-button action-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"
            >
              <i className="ti ti-user" />
              Full Profile
            </Link>
          </>
        }
      >
        <div className="d-flex align-items-center gap-3 mb-3">
          <ImageWithBasePath
            src={teacherProfile.photo}
            alt={teacherProfile.name}
            className="object-fit-cover"
          />
          <div>
            <h5 className="mb-1">{teacherProfile.name}</h5>
            <span className="text-muted d-block">Senior Teacher · Science Department</span>
            <span className="badge badge-soft-warning mt-1">
              <i className="ti ti-star-filled me-1" />
              4.9 Rating
            </span>
          </div>
        </div>

        <div className="info-list d-flex flex-column">
          {profileDetails.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>
      </Modal>

      {/* ----------------------------- Quick Actions -------------------------- */}
      <Modal
        open={active === 'quick'}
        onClose={onClose}
        title="Quick Actions"
        dialogClassName="modal-lg modal-dialog-scrollable"
      >
        <div className="row g-2">
          {quickActionTiles.map((tile) => {
            const body = (
              <>
                <span className="avatar avatar-icon bg-primary-transparent mb-2">
                  <i className={tile.icon} />
                </span>
                <b className="d-block">{tile.title}</b>
                <span className="text-muted fs-12">{tile.subtitle}</span>
              </>
            );

            return (
              <div className="col-6 col-md-4" key={tile.id}>
                {tile.opensAttendance ? (
                  <button
                    type="button"
                    className="w-100 h-100 text-center p-3 rounded bg-transparent"
                    style={{ border: '1px solid var(--bs-border-color)' }}
                    onClick={() => onOpen('quickAttendance')}
                  >
                    {body}
                  </button>
                ) : (
                  <Link
                    to={tile.to ?? routes.adminDashboard}
                    className="d-block h-100 text-center p-3 rounded border text-decoration-none"
                    onClick={onClose}
                  >
                    {body}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </Modal>

      {/* ---------------------------- Send Announcement ----------------------- */}
      <Modal
        open={active === 'announce'}
        onClose={onClose}
        title="Send Announcement"
        onSubmit={announcementForm.handleSubmit}
        footer={
          <>
            <button
              type="button"
              className="action-button d-inline-flex align-items-center text-nowrap text-decoration-none"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="action-button action-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"
            >
              <i className="ti ti-send" />
              Send
            </button>
          </>
        }
      >
        <label className="form-label" htmlFor="send-to">Send To</label>
        <select
          className="form-select mb-3"
          id="send-to"
          name="audience"
          value={announcementForm.values.audience}
          onChange={announcementForm.handleChange}
        >
          {announcementAudiences.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <label className="form-label" htmlFor="an-title">Title</label>
        <input
          type="text"
          className="form-control mb-1"
          id="an-title"
          name="title"
          placeholder="Announcement title"
          value={announcementForm.values.title}
          onChange={announcementForm.handleChange}
          onBlur={announcementForm.handleBlur}
        />
        {fieldError(announcementForm.errors.title, announcementForm.touched.title)}

        <label className="form-label mt-3" htmlFor="an-message">Message</label>
        <textarea
          className="form-control mb-1"
          rows={3}
          id="an-message"
          name="message"
          placeholder="Write your announcement…"
          value={announcementForm.values.message}
          onChange={announcementForm.handleChange}
          onBlur={announcementForm.handleBlur}
        />
        {fieldError(announcementForm.errors.message, announcementForm.touched.message)}
      </Modal>

      {/* ------------------------------ Start Class --------------------------- */}
      <Modal open={active === 'startClass'} onClose={onClose} title="Start Class Session?">
        <div className="text-center">
          <span
            className="avatar avatar-icon bg-success-transparent text-success mb-3 d-inline-flex align-items-center justify-content-center"
            style={{ width: 56, height: 56, fontSize: 28 }}
          >
            <i className="ti ti-player-play" />
          </span>
          <p className="text-muted">
            Science — Physics · Grade IV-B · Lab 02. Attendance will open automatically once
            the session begins.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="action-button d-inline-flex align-items-center text-nowrap text-decoration-none"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="action-button action-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"
              onClick={() => onOpen('quickAttendance')}
            >
              <i className="ti ti-clipboard-check" />
              Start &amp; Take Attendance
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TeacherModals;
