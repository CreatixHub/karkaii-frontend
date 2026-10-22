import { Link } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { StudentCard } from '../data/students.data';

const routes = all_routes;

const ATTENDANCE_TILES = [
  { id: 'present', value: '184', label: 'Present', border: 'border-success' },
  { id: 'absent', value: '9', label: 'Absent', border: 'border-danger' },
  { id: 'late', value: '4', label: 'Late', border: 'border-warning' },
];

const SUBJECTS = [
  { id: 'maths', icon: 'ti ti-math-symbols', name: 'Mathematics', detail: 'Term 2 · Grade A', score: '92%' },
  { id: 'science', icon: 'ti ti-flask', name: 'Science', detail: 'Term 2 · Grade A', score: '88%' },
  { id: 'english', icon: 'ti ti-book', name: 'English', detail: 'Term 2 · Grade B+', score: '79%' },
];

const ACTIVITY = [
  { id: 'a1', icon: 'ti ti-circle-check', iconClass: 'bg-success-transparent', title: 'Marked present for morning assembly', time: '20m' },
  { id: 'a2', icon: 'ti ti-file-certificate', iconClass: 'bg-primary-transparent', title: 'Term 2 report card published', time: '2d' },
  { id: 'a3', icon: 'ti ti-report-money', iconClass: 'bg-warning-transparent', title: 'Fee receipt generated', time: '5d' },
];

const EVENTS = [
  { id: 'e1', icon: 'ti ti-flask', title: 'Science Fair', detail: '25 Jul · Main Hall' },
  { id: 'e2', icon: 'ti ti-users', title: 'Parent Meeting', detail: '28 Jul · Room 12' },
];

export interface StudentPreviewPanelProps {
  student: StudentCard | null;
  onClose: () => void;
}

const StudentPreviewPanel = ({ student, onClose }: StudentPreviewPanelProps) => (
  <Offcanvas
    open={student !== null}
    onClose={onClose}
    title="Student Preview"
    labelledById="student_preview_label"
  >
    {student ? (
      <>
        {/* identity */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="avatar avatar-xl flex-shrink-0">
            <ImageWithBasePath
              src={student.avatar}
              className="img-fluid rounded-circle flex-shrink-0"
              alt={student.name}
            />
            <span
              className={`avatar-status avatar-status-sm avatar-status-inset ${student.presence}`}
            />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="mb-0 text-truncate">{student.name}</h5>
            <p className="fs-12 text-muted mb-1">
              {student.admissionNo} · {student.meta.split(' · ').slice(0, 2).join(' · ')}
            </p>
            <div className="d-flex flex-wrap gap-1">
              {student.chips.map((chip) => (
                <span className={`chip chip-soft ${chip.className}`} key={chip.label}>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* quick actions */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <Link to={routes.studentDetail} className="btn btn-primary btn-sm">
            <i className="ti ti-eye me-1" />
            View Profile
          </Link>
          <Link to={routes.editStudent} className="btn btn-light btn-sm">
            <i className="ti ti-edit-circle me-1" />
            Edit
          </Link>
          <Link to={routes.studentIdCards} className="btn btn-light btn-sm">
            <i className="ti ti-id me-1" />
            ID Card
          </Link>
        </div>

        {/* attendance summary */}
        <h6 className="fs-13 fw-semibold mb-2">
          <i className="ti ti-calendar-check me-1 text-muted" />
          Attendance Summary
        </h6>
        <div className="row g-2 mb-2">
          {ATTENDANCE_TILES.map((tile) => (
            <div className="col-4" key={tile.id}>
              <div className={`metric-tile metric-tile-sm ${tile.border}`}>
                <div className="metric-tile-value">{tile.value}</div>
                <div className="metric-tile-label">{tile.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div
          className="progress progress-sm mb-4"
          role="progressbar"
          aria-label="Attendance"
          aria-valuenow={92}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress-bar bg-success width-92" />
        </div>

        {/* academic summary */}
        <h6 className="fs-13 fw-semibold mb-2">
          <i className="ti ti-chart-line me-1 text-muted" />
          Academic Summary
        </h6>
        <div className="info-list d-flex flex-column mb-4">
          {SUBJECTS.map((subject) => (
            <div className="info-list-item info-list-item-sm d-flex align-items-center" key={subject.id}>
              <span className="avatar bg-body-secondary text-body-secondary flex-shrink-0">
                <i className={subject.icon} />
              </span>
              <div className="info-list-body">
                <b>{subject.name}</b>
                <span>{subject.detail}</span>
              </div>
              <div className="info-list-end flex-shrink-0 text-end d-flex flex-column align-items-end">
                <span className="fw-semibold">{subject.score}</span>
              </div>
            </div>
          ))}
        </div>

        {/* fee summary */}
        <h6 className="fs-13 fw-semibold mb-2">
          <i className="ti ti-report-money me-1 text-muted" />
          Fee Summary
        </h6>
        <div className="info-list-item d-flex align-items-center mb-4">
          <span className="avatar bg-body-secondary text-body-secondary flex-shrink-0">
            <i className="ti ti-cash" />
          </span>
          <div className="info-list-body">
            <b>$2,400 paid</b>
            <span>Term 2 · due 25 Dec</span>
          </div>
          <div className="info-list-end flex-shrink-0 text-end d-flex flex-column align-items-end">
            <span className="badge badge-soft-success">Paid</span>
          </div>
        </div>

        {/* recent activity */}
        <h6 className="fs-13 fw-semibold mb-2">
          <i className="ti ti-activity me-1 text-muted" />
          Recent Activity
        </h6>
        <ul className="activity-feed activity-feed-roomy mb-4">
          {ACTIVITY.map((item) => (
            <li key={item.id}>
              <span className={`avatar avatar-icon avatar-md ${item.iconClass}`}>
                <i className={item.icon} />
              </span>
              <h6 className="mb-1">{item.title}</h6>
              <span className="chip chip-soft chip-muted">
                <i className="ti ti-clock" />
                {item.time}
              </span>
            </li>
          ))}
        </ul>

        {/* upcoming events */}
        <h6 className="fs-13 fw-semibold mb-2">
          <i className="ti ti-calendar-event me-1 text-muted" />
          Upcoming Events
        </h6>
        <div className="info-list d-flex flex-column">
          {EVENTS.map((event) => (
            <div className="info-list-item info-list-item-sm d-flex align-items-center" key={event.id}>
              <span className="avatar bg-body-secondary text-body-secondary flex-shrink-0">
                <i className={event.icon} />
              </span>
              <div className="info-list-body">
                <b>{event.title}</b>
                <span>{event.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    ) : null}
  </Offcanvas>
);

export default StudentPreviewPanel;
