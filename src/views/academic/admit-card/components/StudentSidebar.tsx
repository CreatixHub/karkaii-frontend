import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { AdmitCardStudent, CardAction } from '../data/admitCard.data';
import { quickActions } from '../data/admitCard.data';

export interface StudentSidebarProps {
  student: AdmitCardStudent;
  onAction: (action: CardAction) => void;
}

const StudentSidebar = ({ student, onAction }: StudentSidebarProps) => {
  /* The seven rows the template lists below the profile header. */
  const rows: { label: string; value: string; badge?: string }[] = [
    { label: 'Class', value: student.className },
    { label: 'Section', value: student.section },
    { label: 'House', value: student.house, badge: student.houseBadge },
    { label: 'Date of Birth', value: student.dob },
    { label: 'Gender', value: student.gender },
    { label: 'Parent Name', value: student.parent },
    { label: 'Contact', value: student.contact },
  ];

  return (
    <div className="flex-fill">
      <div className="card">
        <div className="card-header d-flex align-items-center">
          <span className="avatar avatar-sm bg-info-transparent text-info rounded me-2">
            <i className="ti ti-user-circle" />
          </span>
          <h6 className="mb-0">Student Information</h6>
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center pb-3 mb-1 border-bottom">
            <span className="avatar avatar-xl rounded me-3 flex-shrink-0">
              <ImageWithBasePath src={student.photo} alt="Student" />
            </span>
            <div>
              <h6 className="fs-14 mb-1">{student.name}</h6>
              <p className="mb-1 fs-12 text-muted">
                {student.id} &nbsp;•&nbsp; Roll No. {student.rollNo}
              </p>
              <span
                className={`badge ${student.eligibility.badge} d-inline-flex align-items-center`}
              >
                <i className="ti ti-circle-filled fs-5 me-1" />
                {student.eligibility.label}
              </span>
            </div>
          </div>
        </div>
        <ul className="list-group list-group-flush">
          {rows.map((row) => (
            <li
              className="list-group-item d-flex align-items-center justify-content-between"
              key={row.label}
            >
              <span className="fs-13 text-muted">{row.label}</span>
              {row.badge ? (
                <span className={`badge ${row.badge}`}>{row.value}</span>
              ) : (
                <span className="fs-13 fw-medium">{row.value}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <div className="card-header d-flex align-items-center">
          <span className="avatar avatar-sm bg-warning-transparent text-warning rounded me-2">
            <i className="ti ti-bolt" />
          </span>
          <h6 className="mb-0">Quick Actions</h6>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={action.id}
                type="button"
                // The template styles only the first button as primary.
                className={`btn ${
                  index === 0 ? 'btn-primary' : 'btn-outline-light bg-white'
                } d-inline-flex align-items-center justify-content-center`}
                onClick={() => onAction(action)}
              >
                <i className={`${action.icon} me-1`} />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;
