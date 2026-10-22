import Offcanvas from '@components/ui/Offcanvas';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { AttendanceModalId } from '../data/attendanceWorkspace.data';
import { inspectorHistory, inspectorWeek } from '../data/attendanceWorkspace.data';
import type { TeacherAttendanceRow } from '../data/teacherAttendance.data';
import { statusPill } from '../data/teacherAttendance.data';

/** "08:02 AM" → "08:02", the shorter form the inspector tiles use. */
const clockOnly = (value: string) => value.replace(/\s*(AM|PM)$/i, '');

export interface TeacherInspectorProps {
  row: TeacherAttendanceRow | null;
  onClose: () => void;
  onOpenModal: (modal: AttendanceModalId) => void;
}

const TeacherInspector = ({ row, onClose, onOpenModal }: TeacherInspectorProps) => (
  <Offcanvas
    open={row !== null}
    onClose={onClose}
    title="Teacher Inspector"
    labelledById="tea_inspector_lbl"
  >
    {row ? (
      <>
        <div className="d-flex align-items-center gap-2 pb-3 mb-3 border-bottom">
          <span className="avatar avatar-lg">
            <ImageWithBasePath src={row.avatar} className="rounded" alt={row.name} />
          </span>
          <div>
            <h6 className="mb-0">{row.name}</h6>
            <span className="fs-12 text-muted">
              {row.id} · {row.designation} · {row.department}
            </span>
          </div>
          <span className={`dt-pill ${statusPill[row.status]} ms-auto`}>
            <span className="dt-pill-dot" />
            {row.status}
          </span>
        </div>

        <h6 className="fs-13 mb-2">Today&apos;s Attendance</h6>
        <div className="row g-2 mb-3">
          <div className="col-4">
            <div className="border rounded p-2 text-center">
              <span className="fs-11 text-muted d-block">Check-In</span>
              <h6 className="mb-0 text-success">{clockOnly(row.checkIn)}</h6>
            </div>
          </div>
          <div className="col-4">
            <div className="border rounded p-2 text-center">
              <span className="fs-11 text-muted d-block">Check-Out</span>
              <h6 className="mb-0 text-primary">{clockOnly(row.checkOut)}</h6>
            </div>
          </div>
          <div className="col-4">
            <div className="border rounded p-2 text-center">
              <span className="fs-11 text-muted d-block">Hours</span>
              <h6 className="mb-0">{row.workingHours}</h6>
            </div>
          </div>
        </div>

        <h6 className="fs-13 mb-2">Today&apos;s Timetable</h6>
        <ul className="list-unstyled mb-3 fs-13">
          {row.detail.periods.slice(0, 3).map((period, index) => (
            <li
              className={`d-flex align-items-center justify-content-between py-1${index === 2 ? '' : ' border-bottom'}`}
              key={period.code}
            >
              <span>
                <span className="text-muted me-1">{period.code}</span> {period.text}
              </span>
              <span className={period.badge.className}>{period.badge.label}</span>
            </li>
          ))}
        </ul>

        <h6 className="fs-13 mb-2">Weekly Attendance</h6>
        <div className="d-flex justify-content-between mb-3">
          {inspectorWeek.map((item) => (
            <span className={item.className} key={item.day}>
              {item.day}
            </span>
          ))}
        </div>

        <ul className="list-unstyled mb-3">
          <li className="d-flex justify-content-between py-1 fs-13 border-bottom">
            <span className="text-muted">Monthly Present</span>
            <span className="text-dark">21 days</span>
          </li>
          <li className="d-flex justify-content-between py-1 fs-13 border-bottom">
            <span className="text-muted">Attendance Rate</span>
            <span className="text-success fw-semibold">93%</span>
          </li>
          <li className="d-flex justify-content-between py-1 fs-13 border-bottom">
            <span className="text-muted">Subjects</span>
            <span className="text-dark">{row.subjects}</span>
          </li>
          <li className="d-flex justify-content-between py-1 fs-13">
            <span className="text-muted">Assigned Classes</span>
            <span className="text-dark">Grade {row.classes}</span>
          </li>
        </ul>

        <h6 className="fs-13 mb-2">Recent History</h6>
        <ul className="list-unstyled mb-3 fs-13">
          {inspectorHistory.map((item, index) => (
            <li
              className={`d-flex align-items-center justify-content-between py-1${
                index === inspectorHistory.length - 1 ? '' : ' border-bottom'
              }`}
              key={item.when}
            >
              <span>{item.when}</span>
              <span className={item.badge.className}>{item.badge.label}</span>
            </li>
          ))}
        </ul>

        <div className="d-flex gap-2">
          <button type="button" className="btn btn-primary flex-fill" onClick={() => onOpenModal('timetable')}>
            <i className="ti ti-table me-1" />
            Timetable
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white flex-fill"
            onClick={() => onOpenModal('edit')}
          >
            <i className="ti ti-edit me-1" />
            Edit
          </button>
        </div>
      </>
    ) : null}
  </Offcanvas>
);

export default TeacherInspector;
