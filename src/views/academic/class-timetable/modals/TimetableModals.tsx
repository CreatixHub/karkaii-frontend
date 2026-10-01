import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import type { TimetableModalId, TimetableSlot } from '../data/classTimeTable.data';
import { editRooms, editSubjects, editTeachers, swapDays, swapPeriods } from '../data/classTimeTable.data';

export interface TimetableModalsProps {
  active: TimetableModalId | null;
  slot: TimetableSlot | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onSavePeriod: (id: string, patch: { subject: string; teacher: string; room: string }) => void;
  onEditFromDetails: () => void;
}

const DURATIONS = ['45 min', '60 min'];

const TimetableModals = ({
  active,
  slot,
  onClose,
  onToast,
  onSavePeriod,
  onEditFromDetails,
}: TimetableModalsProps) => {
  const [subject, setSubject] = useState(editSubjects[0]);
  const [teacher, setTeacher] = useState(editTeachers[0]);
  const [room, setRoom] = useState(editRooms[0]);
  const [duration, setDuration] = useState(DURATIONS[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [replaceWith, setReplaceWith] = useState(editTeachers[0]);
  const [reason, setReason] = useState('');

  const [swapDay, setSwapDay] = useState(swapDays[0]);
  const [swapPeriod, setSwapPeriod] = useState(swapPeriods[0]);

  const [classroom, setClassroom] = useState(editRooms[0]);

  // Edit and Replace open against the slot that was clicked.
  useEffect(() => {
    if (!slot) return;
    if (active === 'editPeriod') {
      setSubject(slot.subject);
      setTeacher(slot.teacher.name);
      setRoom(slot.room);
      setDuration(slot.duration);
      const [from, to] = slot.time.split(' - ');
      setStartTime(from ?? '');
      setEndTime(to ?? '');
    }
    if (active === 'assignClassroom') setClassroom(slot.room);
  }, [active, slot]);

  const finish = (message: string) => {
    onClose();
    onToast(message);
  };

  return (
    <>
      {/* Edit Period */}
      <Modal
        open={active === 'editPeriod'}
        onClose={onClose}
        title="Edit Period"
        onSubmit={(event) => {
          event.preventDefault();
          if (slot) onSavePeriod(slot.id, { subject, teacher, room });
          finish('Period updated');
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="ctt-edit-subject">
            Subject
          </label>
          <select
            className="form-select"
            id="ctt-edit-subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          >
            {editSubjects.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="ctt-edit-teacher">
            Teacher
          </label>
          <select
            className="form-select"
            id="ctt-edit-teacher"
            value={teacher}
            onChange={(event) => setTeacher(event.target.value)}
          >
            {editTeachers.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="ctt-edit-room">
            Room
          </label>
          <select
            className="form-select"
            id="ctt-edit-room"
            value={room}
            onChange={(event) => setRoom(event.target.value)}
          >
            {editRooms.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="ctt-edit-duration">
            Duration
          </label>
          <select
            className="form-select"
            id="ctt-edit-duration"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
          >
            {DURATIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="ctt-edit-start">
                Start Time
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="09:00 AM"
                id="ctt-edit-start"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-0">
              <label className="form-label" htmlFor="ctt-edit-end">
                End Time
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="09:45 AM"
                id="ctt-edit-end"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Replace Teacher */}
      <Modal
        open={active === 'replaceTeacher'}
        onClose={onClose}
        title="Replace Teacher"
        onSubmit={(event) => {
          event.preventDefault();
          if (slot) onSavePeriod(slot.id, { subject: slot.subject, teacher: replaceWith, room: slot.room });
          finish(`${replaceWith} assigned to the period`);
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Replace
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="ctt-current-teacher">
            Current Teacher
          </label>
          <input
            type="text"
            className="form-control"
            id="ctt-current-teacher"
            value={slot?.teacher.name ?? ''}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="ctt-replace-with">
            Replace With
          </label>
          <select
            className="form-select"
            id="ctt-replace-with"
            value={replaceWith}
            onChange={(event) => setReplaceWith(event.target.value)}
          >
            {editTeachers.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="ctt-reason">
            Reason
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. On leave, substitute"
            id="ctt-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>
      </Modal>

      {/* Swap Period */}
      <Modal
        open={active === 'swapSchedule'}
        onClose={onClose}
        title="Swap Period"
        onSubmit={(event) => {
          event.preventDefault();
          finish(`Period swapped with ${swapDay}`);
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Swap
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="ctt-swap-day">
            Swap With Day
          </label>
          <select
            className="form-select"
            id="ctt-swap-day"
            value={swapDay}
            onChange={(event) => setSwapDay(event.target.value)}
          >
            {swapDays.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="ctt-swap-period">
            Swap With Period
          </label>
          <select
            className="form-select"
            id="ctt-swap-period"
            value={swapPeriod}
            onChange={(event) => setSwapPeriod(event.target.value)}
          >
            {swapPeriods.map((option, index) => (
              <option key={option} value={option}>
                Period {index + 1} · {option}
              </option>
            ))}
          </select>
        </div>
      </Modal>

      {/* Assign Classroom */}
      <Modal
        open={active === 'assignClassroom'}
        onClose={onClose}
        title="Assign Classroom"
        onSubmit={(event) => {
          event.preventDefault();
          if (slot) onSavePeriod(slot.id, { subject: slot.subject, teacher: slot.teacher.name, room: classroom });
          finish(`${classroom} assigned to the period`);
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Assign
            </button>
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="ctt-classroom">
            Classroom
          </label>
          <select
            className="form-select"
            id="ctt-classroom"
            value={classroom}
            onChange={(event) => setClassroom(event.target.value)}
          >
            {editRooms.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </Modal>

      {/* Period Details */}
      <Modal
        open={active === 'timetableDetails'}
        onClose={onClose}
        title="Period Details"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <button type="button" className="btn btn-primary" onClick={onEditFromDetails}>
              <i className="ti ti-edit me-1" />
              Edit Period
            </button>
          </>
        }
      >
        {slot ? (
          <>
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
              <span className={`avatar avatar-md bg-${slot.tone}-transparent text-${slot.iconTone} rounded me-2`}>
                <i className={`${slot.icon} fs-20`} />
              </span>
              <div>
                <h5 className="mb-0 fs-15">{slot.subject}</h5>
                <span className="fs-12 text-muted">
                  {slot.id.startsWith('mon')
                    ? 'Monday'
                    : slot.id.startsWith('tue')
                      ? 'Tuesday'
                      : slot.id.startsWith('wed')
                        ? 'Wednesday'
                        : slot.id.startsWith('thu')
                          ? 'Thursday'
                          : slot.id.startsWith('fri')
                            ? 'Friday'
                            : 'Saturday'}{' '}
                  · Period {slot.id.split('-')[1]}
                </span>
              </div>
            </div>
            <ul className="list-unstyled mb-0">
              <li className="d-flex justify-content-between py-1 fs-13">
                <span className="text-muted">Teacher</span>
                <span className="text-dark">{slot.teacher.name}</span>
              </li>
              <li className="d-flex justify-content-between py-1 fs-13">
                <span className="text-muted">Room</span>
                <span className="text-dark">{slot.room}</span>
              </li>
              <li className="d-flex justify-content-between py-1 fs-13">
                <span className="text-muted">Time</span>
                <span className="text-dark">{slot.time}</span>
              </li>
              <li className="d-flex justify-content-between py-1 fs-13">
                <span className="text-muted">Duration</span>
                <span className="text-dark">{slot.duration}</span>
              </li>
              <li className="d-flex justify-content-between py-1 fs-13">
                <span className="text-muted">Type</span>
                <span className="badge badge-soft-primary">Regular</span>
              </li>
            </ul>
          </>
        ) : null}
      </Modal>

      {/* Add Time Table */}
      <Modal
        open={active === 'addTimeTable'}
        onClose={onClose}
        title="Add Time Table"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          finish('Timetable generated');
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Add Time Table
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="ctt-add-class">
                Class
              </label>
              <select className="form-select" id="ctt-add-class" defaultValue="Class III">
                <option>Class I</option>
                <option>Class II</option>
                <option>Class III</option>
                <option>Class IV</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="ctt-add-section">
                Section
              </label>
              <select className="form-select" id="ctt-add-section" defaultValue="A">
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="ctt-add-start">
                Period Start Time
              </label>
              <select className="form-select" id="ctt-add-start" defaultValue="Select">
                <option>Select</option>
                <option>09:00 AM</option>
                <option>09:45 AM</option>
                <option>10:45 AM</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="ctt-add-duration">
                Duration
              </label>
              <select className="form-select" id="ctt-add-duration" defaultValue="Select">
                <option>Select</option>
                <option>45 Mins</option>
                <option>1 Hour</option>
              </select>
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-0">
              <label className="form-label" htmlFor="ctt-add-subject">
                Subject
              </label>
              <select className="form-select" id="ctt-add-subject" defaultValue="Select">
                <option>Select</option>
                <option>English</option>
                <option>Spanish</option>
                <option>Physics</option>
                <option>Maths</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TimetableModals;
