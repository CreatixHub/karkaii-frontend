import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import { all_routes } from '@/routes/all_routes';
import { useForm } from '@hooks/useForm';
import type { TimetableSlot } from '../data/teacherTimeTable.data';
import {
  classInformationRows,
  classroomOptions,
  editSessionClasses,
  editSessionModes,
  editSessionRooms,
  editSessionSubjects,
  meetingDetailRows,
  scheduleDetailRows,
  substituteTeachers,
  swapDays,
  swapPeriods,
} from '../data/teacherTimeTable.data';

const routes = all_routes;

export type TimetableModalId =
  | 'scheduleDetails'
  | 'meetingDetails'
  | 'editSession'
  | 'assignSubstitute'
  | 'swapSchedule'
  | 'changeClassroom'
  | 'classInformation'
  | 'addTimeTable';

/** The card a dialog was opened from, plus where it sits in the week. */
export interface ActiveSession {
  slot: TimetableSlot;
  day: string;
  period: number;
}

/* Every teaching card's meta row runs class · room · students · duration. */
const metaAt = (slot: TimetableSlot, index: number) => slot.metas[index]?.label ?? '';

/** "Class III - A" → "III - A", the short form the dialogs print. */
const shortClass = (label: string) => label.replace(/^Class\s+/, '');

/** "Class III - A" → "Class III - Section A". */
const sectionClass = (label: string) => label.replace(/\s-\s([A-Z])$/, ' - Section $1');

/** The mode chip ("Offline" / "Online" / "Hybrid") is always the last badge. */
const modeBadge = (slot: TimetableSlot) => slot.badges[slot.badges.length - 1];

/** "09:00 - 09:45 AM" → ["09:00 AM", "09:45 AM"]. */
const splitTime = (time: string) => {
  const [from = '', to = ''] = time.split(' - ');
  const suffix = to.slice(-2);
  return [from.includes('M') ? from : `${from} ${suffix}`, to];
};

export interface TimeTableModalsProps {
  active: TimetableModalId | null;
  session: ActiveSession | null;
  onClose: () => void;
  onOpen: (modal: TimetableModalId) => void;
  onToast: (message: string) => void;
}

const TimeTableModals = ({ active, session, onClose, onOpen, onToast }: TimeTableModalsProps) => {
  const slot = session?.slot ?? null;
  const classLabel = slot ? metaAt(slot, 0) : '';
  const room = slot ? metaAt(slot, 1) : '';
  const students = slot ? metaAt(slot, 2).replace(' students', '') : '';
  const duration = slot ? metaAt(slot, 3) : '';
  const mode = slot ? modeBadge(slot) : undefined;
  const [startTime, endTime] = splitTime(slot?.time ?? '09:00 - 09:45 AM');

  /* ------------------------------ Edit Session ----------------------------- */
  const editForm = useForm<
    {
      subject: string;
      className: string;
      classroom: string;
      mode: string;
      startTime: string;
      endTime: string;
    },
    string
  >({
    initialValues: {
      subject: '',
      className: '',
      classroom: '',
      mode: '',
      startTime: '',
      endTime: '',
    },
    onSubmit: async () => 'Session updated',
    onSuccess: (message) => {
      onToast(message);
      editForm.reset();
      onClose();
    },
  });

  /* --------------------------- Assign Substitute --------------------------- */
  const substituteForm = useForm<{ teacher: string; reason: string }, string>({
    initialValues: { teacher: substituteTeachers[0], reason: '' },
    onSubmit: async (values) => `${values.teacher} assigned as substitute`,
    onSuccess: (message) => {
      onToast(message);
      substituteForm.reset();
      onClose();
    },
  });

  /* ------------------------------- Swap Class ------------------------------ */
  const swapForm = useForm<{ day: string; period: string }, string>({
    initialValues: { day: swapDays[0], period: swapPeriods[0] },
    onSubmit: async (values) => `Session swapped with ${values.day}`,
    onSuccess: (message) => {
      onToast(message);
      swapForm.reset();
      onClose();
    },
  });

  /* ---------------------------- Change Classroom --------------------------- */
  const classroomForm = useForm<{ classroom: string }, string>({
    initialValues: { classroom: classroomOptions[0] },
    onSubmit: async (values) => `Classroom changed to ${values.classroom}`,
    onSuccess: (message) => {
      onToast(message);
      classroomForm.reset();
      onClose();
    },
  });

  const detailRows = slot?.metas.length
    ? [
        { label: 'Classroom', value: room },
        { label: 'Time', value: slot.time },
        { label: 'Duration', value: duration },
        { label: 'Students', value: students },
        {
          label: 'Mode',
          value: mode?.label ?? 'Offline',
          badgeClass: mode?.className ?? 'badge-soft-secondary',
        },
      ]
    : scheduleDetailRows;

  return (
    <>
      {/* ---------------------------- Schedule Details --------------------------- */}
      <Modal
        open={active === 'scheduleDetails'}
        onClose={onClose}
        title="Schedule Details"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-outline-light bg-white"
              onClick={() => onOpen('classInformation')}
            >
              <i className="ti ti-info-circle me-1" />
              Class Info
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onOpen('editSession')}
            >
              <i className="ti ti-edit me-1" />
              Edit Session
            </button>
          </>
        }
      >
        <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
          <span
            className={`avatar avatar-md bg-${slot?.tone ?? 'warning'}-transparent ${
              slot?.iconTone ?? 'text-warning'
            } rounded me-2`}
          >
            <i className={`${slot?.icon ?? 'ti ti-atom'} fs-20`} />
          </span>
          <div>
            <h5 className="mb-0 fs-15">
              {slot ? `${slot.subject}${classLabel ? ` · ${classLabel}` : ''}` : 'Physics · Class III - A'}
            </h5>
            <span className="fs-12 text-muted">
              {session ? `${session.day} · Period ${session.period}` : 'Monday · Period 1'}
            </span>
          </div>
        </div>
        <ul className="list-unstyled mb-0">
          {detailRows.map((row) => (
            <li className="d-flex justify-content-between py-1 fs-13" key={row.label}>
              <span className="text-muted">{row.label}</span>
              {row.badgeClass ? (
                <span className={`badge ${row.badgeClass}`}>{row.value}</span>
              ) : (
                <span className="text-dark">{row.value}</span>
              )}
            </li>
          ))}
        </ul>
      </Modal>

      {/* ------------------------------ Edit Session ----------------------------- */}
      <Modal
        open={active === 'editSession'}
        onClose={onClose}
        title="Edit Session"
        onSubmit={editForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={editForm.isSubmitting}>
              Save Changes
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="subject-2">
                Subject
              </label>
              {/* The template hands these to choices.js; Bootstrap's own
                  `form-select` carries the look without the plugin. */}
              <select
                className="select form-select"
                id="subject-2"
                name="subject"
                value={editForm.values.subject || slot?.subject || editSessionSubjects[0]}
                onChange={editForm.handleChange}
              >
                {editSessionSubjects.map((option) => (
                  <option key={option}>{option}</option>
                ))}
                {slot && !editSessionSubjects.includes(slot.subject) ? (
                  <option>{slot.subject}</option>
                ) : null}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="class">
                Class
              </label>
              <select
                className="select form-select"
                id="class"
                name="className"
                value={
                  editForm.values.className ||
                  (classLabel ? shortClass(classLabel) : editSessionClasses[0])
                }
                onChange={editForm.handleChange}
              >
                {editSessionClasses.map((option) => (
                  <option key={option}>{option}</option>
                ))}
                {classLabel && !editSessionClasses.includes(shortClass(classLabel)) ? (
                  <option>{shortClass(classLabel)}</option>
                ) : null}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="classroom">
                Classroom
              </label>
              <select
                className="select form-select"
                id="classroom"
                name="classroom"
                value={editForm.values.classroom || room || editSessionRooms[0]}
                onChange={editForm.handleChange}
              >
                {editSessionRooms.map((option) => (
                  <option key={option}>{option}</option>
                ))}
                {room && !editSessionRooms.includes(room) ? <option>{room}</option> : null}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="mode">
                Mode
              </label>
              <select
                className="select form-select"
                id="mode"
                name="mode"
                value={editForm.values.mode || mode?.label || editSessionModes[0]}
                onChange={editForm.handleChange}
              >
                {editSessionModes.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="start-time">
                Start Time
              </label>
              <input
                type="text"
                className="form-control timepicker"
                placeholder={startTime}
                id="start-time"
                name="startTime"
                value={editForm.values.startTime}
                onChange={editForm.handleChange}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-0">
              <label className="form-label" htmlFor="end-time">
                End Time
              </label>
              <input
                type="text"
                className="form-control timepicker"
                placeholder={endTime}
                id="end-time"
                name="endTime"
                value={editForm.values.endTime}
                onChange={editForm.handleChange}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* ---------------------------- Assign Substitute --------------------------- */}
      <Modal
        open={active === 'assignSubstitute'}
        onClose={onClose}
        title="Assign Substitute"
        onSubmit={substituteForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={substituteForm.isSubmitting}
            >
              Assign Substitute
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="session">
            Session
          </label>
          <input
            type="text"
            className="form-control"
            value={
              slot
                ? [slot.subject, classLabel ? shortClass(classLabel) : null, slot.time]
                    .filter(Boolean)
                    .join(' · ')
                : 'Physics · III - A · 09:00 - 09:45 AM'
            }
            readOnly
            id="session"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="substitute-teacher">
            Substitute Teacher
          </label>
          <select
            className="select form-select"
            id="substitute-teacher"
            name="teacher"
            value={substituteForm.values.teacher}
            onChange={substituteForm.handleChange}
          >
            {substituteTeachers.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="reason">
            Reason
          </label>
          <textarea
            rows={2}
            className="form-control"
            placeholder="e.g. On leave, training"
            id="reason"
            name="reason"
            value={substituteForm.values.reason}
            onChange={substituteForm.handleChange}
          />
        </div>
      </Modal>

      {/* -------------------------------- Swap Class ------------------------------ */}
      <Modal
        open={active === 'swapSchedule'}
        onClose={onClose}
        title="Swap Class"
        onSubmit={swapForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={swapForm.isSubmitting}>
              Swap
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="swap-with-day">
            Swap With Day
          </label>
          <select
            className="select form-select"
            id="swap-with-day"
            name="day"
            value={swapForm.values.day}
            onChange={swapForm.handleChange}
          >
            {swapDays.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="swap-with-period">
            Swap With Period
          </label>
          <select
            className="select form-select"
            id="swap-with-period"
            name="period"
            value={swapForm.values.period}
            onChange={swapForm.handleChange}
          >
            {swapPeriods.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </Modal>

      {/* ----------------------------- Change Classroom --------------------------- */}
      <Modal
        open={active === 'changeClassroom'}
        onClose={onClose}
        title="Change Classroom"
        onSubmit={classroomForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={classroomForm.isSubmitting}
            >
              Change
            </button>
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="classroom-2">
            Classroom
          </label>
          <select
            className="select form-select"
            id="classroom-2"
            name="classroom"
            value={classroomForm.values.classroom}
            onChange={classroomForm.handleChange}
          >
            {classroomOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </Modal>

      {/* ----------------------------- Meeting Details ---------------------------- */}
      <Modal
        open={active === 'meetingDetails'}
        onClose={onClose}
        title="Meeting Details"
        footer={
          <>
            <button type="button" className="btn btn-light" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onToast('Meeting added to calendar')}
            >
              Add to Calendar
            </button>
          </>
        }
      >
        <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
          <span
            className={`avatar avatar-md bg-${slot?.tone ?? 'primary'}-transparent ${
              slot?.iconTone ?? 'text-primary'
            } rounded me-2`}
          >
            <i className={`${slot?.icon ?? 'ti ti-users-group'} fs-20`} />
          </span>
          <div>
            <h5 className="mb-0 fs-15">{slot?.subject ?? 'Staff Meeting'}</h5>
            <span className="fs-12 text-muted">
              {session ? `${session.day} · ${session.slot.time}` : 'Monday · 02:15 - 03:00 PM'}
            </span>
          </div>
        </div>
        <ul className="list-unstyled mb-3">
          {meetingDetailRows.map((row) => (
            <li className="d-flex justify-content-between py-1 fs-13" key={row.label}>
              <span className="text-muted">{row.label}</span>
              <span className="text-dark">{row.value}</span>
            </li>
          ))}
        </ul>
        <div className="alert alert-info d-flex align-items-center mb-0" role="alert">
          <i className="ti ti-info-circle me-2" />
          <span>Attendance is mandatory for all faculty.</span>
        </div>
      </Modal>

      {/* ---------------------------- Class Information --------------------------- */}
      <Modal open={active === 'classInformation'} onClose={onClose} title="Class Information">
        <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
          <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2">
            <i className="ti ti-users fs-20" />
          </span>
          <div>
            <h5 className="mb-0 fs-15">
              {classLabel ? sectionClass(classLabel) : 'Class III - Section A'}
            </h5>
            <span className="fs-12 text-muted">{students || '32'} Students · Homeroom</span>
          </div>
        </div>
        <ul className="list-unstyled mb-3">
          {classInformationRows.map((row) => (
            <li className="d-flex justify-content-between py-1 fs-13" key={row.label}>
              <span className="text-muted">{row.label}</span>
              <span className="text-dark">{row.value}</span>
            </li>
          ))}
        </ul>
        <div className="d-flex gap-2">
          <Link to={routes.studentGrid} className="btn btn-outline-light bg-white flex-fill">
            <i className="ti ti-users me-1" />
            View Students
          </Link>
          <Link to={routes.studentAttendance} className="btn btn-primary flex-fill">
            <i className="ti ti-calendar-check me-1" />
            Attendance
          </Link>
        </div>
      </Modal>
    </>
  );
};

export default TimeTableModals;
