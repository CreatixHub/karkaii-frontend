import { useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import {
  quickAttendanceClasses,
  quickAttendanceStudents,
} from '../data/teacherModals.data';

type Attendance = Record<string, 'present' | 'absent'>;

const INITIAL_ATTENDANCE: Attendance = Object.fromEntries(
  quickAttendanceStudents.map((student) => [student.id, 'present' as const]),
);

export interface QuickAttendanceModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const QuickAttendanceModal = ({ open, onClose, onSaved }: QuickAttendanceModalProps) => {
  const [selectedClass, setSelectedClass] = useState(quickAttendanceClasses[0]);
  const [attendance, setAttendance] = useState<Attendance>(INITIAL_ATTENDANCE);

  const { present, absent } = useMemo(() => {
    const values = Object.values(attendance);
    return {
      present: values.filter((value) => value === 'present').length,
      absent: values.filter((value) => value === 'absent').length,
    };
  }, [attendance]);

  const setStatus = (id: string, status: 'present' | 'absent') => {
    setAttendance((current) => ({ ...current, [id]: status }));
  };

  const markAllPresent = () => setAttendance(INITIAL_ATTENDANCE);

  const handleSave = () => {
    onSaved(`Attendance saved for ${selectedClass}.`);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Quick Attendance"
      dialogClassName="modal-lg modal-dialog-scrollable"
      footer={
        <>
          <span className="widget-subtitle me-auto">
            <i className="ti ti-info-circle me-1" />
            Tap a name row to toggle status
          </span>
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
            onClick={handleSave}
          >
            <i className="ti ti-device-floppy" />
            Save Attendance
          </button>
        </>
      }
    >
      <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
        <div className="form-field">
          <select
            className="form-select"
            aria-label="Select class"
            style={{ minWidth: 190 }}
            value={selectedClass}
            onChange={(event) => setSelectedClass(event.target.value)}
          >
            {quickAttendanceClasses.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="d-flex align-items-center gap-2 ms-auto">
          <span className="badge badge-soft-success">
            <i className="ti ti-user-check" />
            Present <b className="ms-1">{present}</b>
          </span>
          <span className="badge badge-soft-danger">
            <i className="ti ti-user-x" />
            Absent <b className="ms-1">{absent}</b>
          </span>
          <button
            type="button"
            className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
            onClick={markAllPresent}
          >
            <i className="ti ti-checks" />
            Mark all present
          </button>
        </div>
      </div>

      <div className="info-list d-flex flex-column">
        {quickAttendanceStudents.map((student) => {
          const status = attendance[student.id];
          return (
            <div className="info-list-item d-flex align-items-center" key={student.id}>
              <ImageWithBasePath
                className="info-list-avatar object-fit-cover flex-shrink-0"
                src={student.avatar}
                alt={student.name}
              />
              <div className="info-list-body">
                <b>{student.name}</b>
                <span>{student.roll}</span>
              </div>
              <div className="quick-action-toggle info-list-end d-inline-flex overflow-hidden flex-shrink-0">
                <button
                  type="button"
                  className={`p${status === 'present' ? ' active' : ''}`}
                  aria-pressed={status === 'present'}
                  onClick={() => setStatus(student.id, 'present')}
                >
                  Present
                </button>
                <button
                  type="button"
                  className={`a${status === 'absent' ? ' active' : ''}`}
                  aria-pressed={status === 'absent'}
                  onClick={() => setStatus(student.id, 'absent')}
                >
                  Absent
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default QuickAttendanceModal;
