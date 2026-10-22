import { useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import ImageWithBasePath from '@core/common/imageWithBasePath';

export interface SchedulePanelProps {
  open: boolean;
  onClose: () => void;
  onSaveNote: (note: string) => void;
}

const subjectLegend = [
  { label: 'Maths', badge: 'badge-soft-danger' },
  { label: 'English', badge: 'badge-soft-primary' },
  { label: 'Computer', badge: 'badge-soft-success' },
  { label: 'Physics', badge: 'badge-soft-warning' },
  { label: 'Science', badge: 'badge-soft-info' },
  { label: 'Chemistry', badge: 'badge-soft-secondary' },
];

const teacherAvailability = [
  { name: 'Teresa', avatar: 'assets/img/teachers/teacher-01.jpg', status: 'Available', badge: 'badge-soft-success' },
  { name: 'Hellana', avatar: 'assets/img/teachers/teacher-03.jpg', status: 'In Class', badge: 'badge-soft-danger' },
  { name: 'Morgan', avatar: 'assets/img/teachers/teacher-05.jpg', status: 'On Leave', badge: 'badge-soft-warning' },
];

const roomAvailability = [
  { name: 'Room 101', icon: 'ti ti-door', status: 'Free', badge: 'badge-soft-success' },
  { name: 'Lab 1', icon: 'ti ti-flask', status: 'Occupied', badge: 'badge-soft-danger' },
  { name: 'Room 104', icon: 'ti ti-door', status: 'Free', badge: 'badge-soft-success' },
];

const todayClasses = [
  { subject: 'Maths', icon: 'ti ti-math-symbols', tone: 'bg-danger-transparent text-danger', meta: '09:00 - 09:45 AM · Room 101' },
  { subject: 'English', icon: 'ti ti-abc', tone: 'bg-primary-transparent text-primary', meta: '09:45 - 10:30 AM · Room 102' },
];

const upcomingChanges = [
  {
    title: 'Substitute for Spanish',
    icon: 'ti ti-user-check',
    tone: 'bg-warning-transparent text-warning',
    meta: 'Tomorrow · Erickson',
  },
  {
    title: 'Physics & Science swapped',
    icon: 'ti ti-arrows-exchange',
    tone: 'bg-info-transparent text-info',
    meta: 'Fri · Period 5',
  },
];

const SchedulePanel = ({ open, onClose, onSaveNote }: SchedulePanelProps) => {
  const [note, setNote] = useState('');

  return (
    <Offcanvas open={open} onClose={onClose} title="Schedule Info" placement="end">
      <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Subject Legend</h6>
      <div className="d-flex flex-wrap gap-2 mb-4">
        {subjectLegend.map((item) => (
          <span className={`badge ${item.badge}`} key={item.label}>
            <i className="ti ti-circle-filled fs-5 me-1" />
            {item.label}
          </span>
        ))}
      </div>

      <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Teacher Availability</h6>
      <ul className="list-unstyled mb-4">
        {teacherAvailability.map((teacher, index) => (
          <li
            className={`d-flex align-items-center justify-content-between ${
              index === teacherAvailability.length - 1 ? 'mb-0' : 'mb-2'
            }`}
            key={teacher.name}
          >
            <span className="d-flex align-items-center">
              <span className="avatar avatar-sm me-2">
                <ImageWithBasePath
                  src={teacher.avatar}
                  className="rounded-circle flex-shrink-0"
                  alt={teacher.name}
                />
              </span>
              {teacher.name}
            </span>
            <span className={`badge ${teacher.badge}`}>{teacher.status}</span>
          </li>
        ))}
      </ul>

      <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Room Availability</h6>
      <ul className="list-unstyled mb-4">
        {roomAvailability.map((room, index) => (
          <li
            className={`d-flex align-items-center justify-content-between ${
              index === roomAvailability.length - 1 ? 'mb-0' : 'mb-2'
            }`}
            key={room.name}
          >
            <span>
              <i className={`${room.icon} me-2`} />
              {room.name}
            </span>
            <span className={`badge ${room.badge}`}>{room.status}</span>
          </li>
        ))}
      </ul>

      <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Today&apos;s Classes</h6>
      <ul className="list-unstyled mb-4">
        {todayClasses.map((item, index) => (
          <li
            className={`d-flex align-items-center ${index === todayClasses.length - 1 ? 'mb-0' : 'mb-2'}`}
            key={item.subject}
          >
            <span className={`avatar avatar-sm ${item.tone} rounded me-2`}>
              <i className={item.icon} />
            </span>
            <div>
              <p className="mb-0 fs-13 text-dark">{item.subject}</p>
              <span className="fs-12 text-muted">{item.meta}</span>
            </div>
          </li>
        ))}
      </ul>

      <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Upcoming Schedule Changes</h6>
      <ul className="list-unstyled mb-4">
        {upcomingChanges.map((item, index) => (
          <li className={`d-flex ${index === upcomingChanges.length - 1 ? 'mb-0' : 'mb-2'}`} key={item.title}>
            <span className={`avatar avatar-xs ${item.tone} rounded-circle flex-shrink-0 me-2`}>
              <i className={item.icon} />
            </span>
            <div>
              <p className="mb-0 fs-13 text-dark">{item.title}</p>
              <span className="fs-12 text-muted">{item.meta}</span>
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
            onSaveNote(note);
            setNote('');
          }}
        >
          Save Note
        </button>
      </div>
    </Offcanvas>
  );
};

export default SchedulePanel;
