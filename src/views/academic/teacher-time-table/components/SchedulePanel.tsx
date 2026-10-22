import { useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import {
  meetingReminders,
  panelFreePeriods,
  pendingTasks,
  roomAssignments,
  todaySchedule,
  upcomingClasses,
} from '../data/teacherTimeTable.data';

export interface SchedulePanelProps {
  open: boolean;
  onClose: () => void;
  onToast: (message: string) => void;
}

const SchedulePanel = ({ open, onClose, onToast }: SchedulePanelProps) => {
  const [done, setDone] = useState<Record<string, boolean>>(() =>
    pendingTasks.reduce<Record<string, boolean>>((acc, task) => {
      acc[task.id] = task.done;
      return acc;
    }, {}),
  );
  const [note, setNote] = useState('');

  return (
    <Offcanvas open={open} onClose={onClose} title="Schedule Info" labelledById="ctt_panel_label">
      <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Today&apos;s Schedule</h6>
      <ul className="list-unstyled mb-4">
        {todaySchedule.map((session, index) => (
          <li
            className={`d-flex align-items-center ${
              index === todaySchedule.length - 1 ? 'mb-0' : 'mb-2'
            }`}
            key={session.title}
          >
            <span className={`avatar avatar-sm ${session.iconClass} rounded me-2`}>
              <i className={session.icon} />
            </span>
            <div>
              <p className="mb-0 fs-13 text-dark">{session.title}</p>
              <span className="fs-12 text-muted">{session.subtitle}</span>
            </div>
          </li>
        ))}
      </ul>

      <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Upcoming Classes</h6>
      <ul className="list-unstyled mb-4">
        {upcomingClasses.map((item, index) => (
          <li
            className={`d-flex align-items-center justify-content-between ${
              index === upcomingClasses.length - 1 ? 'mb-0' : 'mb-2'
            }`}
            key={item.label}
          >
            <span className="d-flex align-items-center">
              <span className={`avatar avatar-sm ${item.iconClass} rounded me-2`}>
                <i className={item.icon} />
              </span>
              <span className="fs-13 text-dark">{item.label}</span>
            </span>
            <span className="badge badge-soft-primary">{item.time}</span>
          </li>
        ))}
      </ul>

      <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Free Periods</h6>
      <div className="d-flex flex-wrap gap-2 mb-4">
        {panelFreePeriods.map((slot) => (
          <span className="badge badge-soft-secondary" key={slot}>
            <i className="ti ti-coffee me-1" />
            {slot}
          </span>
        ))}
      </div>

      <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Room Assignments</h6>
      <ul className="list-unstyled mb-4">
        {roomAssignments.map((room, index) => (
          <li
            className={`d-flex align-items-center justify-content-between ${
              index === roomAssignments.length - 1 ? 'mb-0' : 'mb-2'
            }`}
            key={room.room}
          >
            <span>
              <i className={room.icon} />
              {room.room}
            </span>
            <span className={`badge ${room.badgeClass}`}>{room.subject}</span>
          </li>
        ))}
      </ul>

      <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Meeting Reminders</h6>
      <ul className="list-unstyled mb-4">
        {meetingReminders.map((meeting, index) => (
          <li
            className={`d-flex ${index === meetingReminders.length - 1 ? 'mb-0' : 'mb-2'}`}
            key={meeting.title}
          >
            <span
              className={`avatar avatar-xs ${meeting.iconClass} rounded-circle flex-shrink-0 me-2`}
            >
              <i className={meeting.icon} />
            </span>
            <div>
              <p className="mb-0 fs-13 text-dark">{meeting.title}</p>
              <span className="fs-12 text-muted">{meeting.subtitle}</span>
            </div>
          </li>
        ))}
      </ul>

      <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Pending Tasks</h6>
      <ul className="list-unstyled mb-4">
        {pendingTasks.map((task, index) => (
          <li
            className={`d-flex align-items-center ${
              index === pendingTasks.length - 1 ? 'mb-0' : 'mb-2'
            }`}
            key={task.id}
          >
            <div className="form-check mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                id={task.id}
                checked={done[task.id] ?? false}
                onChange={(event) =>
                  setDone((current) => ({ ...current, [task.id]: event.target.checked }))
                }
              />
              <label
                className={`form-check-label fs-13${
                  done[task.id] ? ' text-muted text-decoration-line-through' : ''
                }`}
                htmlFor={task.id}
              >
                {task.label}
              </label>
            </div>
          </li>
        ))}
      </ul>

      <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Quick Notes</h6>
      <textarea
        className="form-control"
        rows={3}
        placeholder="Add a quick note..."
        aria-label="Add a quick note..."
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
      <div className="text-end mt-2">
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={() => {
            onToast(note.trim() ? 'Note saved' : 'Nothing to save');
            if (note.trim()) setNote('');
          }}
        >
          Save Note
        </button>
      </div>
    </Offcanvas>
  );
};

export default SchedulePanel;
