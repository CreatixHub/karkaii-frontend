import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { TeacherCard } from '../data/teachers.data';
import { profileSections } from '../data/teachersWorkspace.data';

const routes = all_routes;

export interface TeacherProfilePanelProps {
  teacher: TeacherCard | null;
  onClose: () => void;
}

const TeacherProfilePanel = ({ teacher, onClose }: TeacherProfilePanelProps) => {
  const [open, setOpen] = useState('tp_info');

  // Every card opens the panel on its first section, as the template did.
  useEffect(() => {
    if (teacher) setOpen('tp_info');
  }, [teacher]);

  if (!teacher) return null;

  const department = teacher.department.replace(/\s*Dept\.$/, '');
  const joiningDate = teacher.joined.replace(/^Joined\s+/, '');
  const lastLogin = teacher.lastLogin.replace(/^Last login\s+/, '');
  const experienceYears = teacher.experience.replace(/\s*yrs$/, ' Years');
  const attendance = teacher.metrics[0].value;

  const bodies: Record<string, React.ReactNode> = {
    tp_info: (
      <div className="row g-3">
        <div className="col-6">
          <p className="mb-0 fs-12">Employee ID</p>
          <p className="text-dark mb-0">{teacher.id}</p>
        </div>
        <div className="col-6">
          <p className="mb-0 fs-12">Department</p>
          <p className="text-dark mb-0">{department}</p>
        </div>
        <div className="col-6">
          <p className="mb-0 fs-12">Branch</p>
          <p className="text-dark mb-0">{teacher.branch}</p>
        </div>
        <div className="col-6">
          <p className="mb-0 fs-12">Joining Date</p>
          <p className="text-dark mb-0">{joiningDate}</p>
        </div>
        <div className="col-6">
          <p className="mb-0 fs-12">Last Login</p>
          <p className="text-dark mb-0">{lastLogin}</p>
        </div>
        <div className="col-6">
          <p className="mb-0 fs-12">Status</p>
          <p className="text-dark mb-0">{teacher.status}</p>
        </div>
      </div>
    ),
    tp_prof: (
      <div className="row g-3">
        <div className="col-6">
          <p className="mb-0 fs-12">Designation</p>
          <p className="text-dark mb-0">Senior Teacher</p>
        </div>
        <div className="col-6">
          <p className="mb-0 fs-12">Employment Type</p>
          <p className="text-dark mb-0">{teacher.employment.label}</p>
        </div>
        <div className="col-6">
          <p className="mb-0 fs-12">Experience</p>
          <p className="text-dark mb-0">{experienceYears}</p>
        </div>
        <div className="col-6">
          <p className="mb-0 fs-12">Reporting To</p>
          <p className="text-dark mb-0">Academic Head</p>
        </div>
      </div>
    ),
    tp_classes: (
      <div className="d-flex flex-wrap gap-2">
        <span className="badge badge-soft-primary">III A (Class Teacher)</span>
        <span className="badge badge-soft-primary">IV B</span>
        <span className="badge badge-soft-primary">V A</span>
      </div>
    ),
    tp_subjects: (
      <div className="d-flex flex-wrap gap-2">
        <span className="badge badge-soft-info">{teacher.subject}</span>
        <span className="badge badge-soft-info">General Science</span>
      </div>
    ),
    tp_contact: (
      <>
        <p className="mb-2">
          <i className="ti ti-phone text-muted me-2" />
          {teacher.phone}
        </p>
        <p className="mb-2">
          <i className="ti ti-mail text-muted me-2" />
          {teacher.email}
        </p>
        <p className="mb-0">
          <i className="ti ti-map-pin text-muted me-2" />
          1250 Elm Street, Springfield, IL
        </p>
      </>
    ),
    tp_qual: (
      <ul className="list-unstyled mb-0">
        <li className="mb-2">
          <i className="ti ti-school text-primary me-2" />
          M.Sc Physics — State University, 2014
        </li>
        <li className="mb-0">
          <i className="ti ti-school text-primary me-2" />
          B.Ed — National College, 2015
        </li>
      </ul>
    ),
    tp_exp: (
      <>
        <div className="d-flex mb-3">
          <span className="avatar avatar-sm bg-soft-primary text-primary rounded flex-shrink-0">
            <i className="ti ti-building" />
          </span>
          <div className="ms-2">
            <p className="mb-0 fs-13 text-dark">Senior Teacher — Preskool</p>
            <span className="fs-12 text-muted">2019 – Present</span>
          </div>
        </div>
        <div className="d-flex mb-0">
          <span className="avatar avatar-sm bg-soft-secondary text-secondary rounded flex-shrink-0">
            <i className="ti ti-building" />
          </span>
          <div className="ms-2">
            <p className="mb-0 fs-13 text-dark">Teacher — Bright Academy</p>
            <span className="fs-12 text-muted">2015 – 2019</span>
          </div>
        </div>
      </>
    ),
    tp_att: (
      <>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="fs-13">Present This Month</span>
          <span className="fw-semibold text-dark">22 / 23</span>
        </div>
        <div className="progress progress-xs mb-3">
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${attendance}%` }}
            aria-valuenow={attendance}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="d-flex flex-wrap gap-2">
          <span className="badge badge-soft-success">{attendance}% Present</span>
          <span className="badge badge-soft-warning">1 Leave</span>
          <span className="badge badge-soft-danger">0 Absent</span>
        </div>
      </>
    ),
    tp_act: (
      <ul className="list-unstyled mb-0">
        <li className="mb-2">
          <i className="ti ti-checklist text-success me-2" />
          Uploaded Term-1 assignments <span className="fs-12 text-muted">· 2 hrs ago</span>
        </li>
        <li className="mb-2">
          <i className="ti ti-calendar-check text-info me-2" />
          Marked III A attendance <span className="fs-12 text-muted">· Today</span>
        </li>
        <li className="mb-0">
          <i className="ti ti-message text-primary me-2" />
          Replied to parent query <span className="fs-12 text-muted">· Yesterday</span>
        </li>
      </ul>
    ),
    tp_docs: (
      <>
        <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-2">
          <span className="text-dark">
            <i className="ti ti-file-type-pdf text-danger me-2" />
            Resume.pdf
          </span>
          <Link to="#" className="btn btn-icon btn-sm btn-outline-light bg-white" aria-label="Download">
            <i className="ti ti-download" />
          </Link>
        </div>
        <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-0">
          <span className="text-dark">
            <i className="ti ti-file-type-pdf text-danger me-2" />
            Degree_Certificate.pdf
          </span>
          <Link to="#" className="btn btn-icon btn-sm btn-outline-light bg-white" aria-label="Download">
            <i className="ti ti-download" />
          </Link>
        </div>
      </>
    ),
  };

  return (
    <Offcanvas
      open
      onClose={onClose}
      title="Teacher Profile"
      labelledById="teacher_profile_label"
    >
      <div className="d-flex align-items-center mb-3">
        <span className={`avatar avatar-xl${teacher.online ? ' online' : ''} flex-shrink-0 me-3`}>
          <ImageWithBasePath src={teacher.avatar} className="rounded-circle flex-shrink-0" alt="img" />
        </span>
        <div>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
            <h5 className="mb-0">{teacher.name}</h5>
            <span className={`badge ${teacher.employment.className}`}>{teacher.employment.label}</span>
          </div>
          <p className="mb-1">
            <span className="link-primary">{teacher.id}</span> ·{' '}
            <span className="badge badge-soft-primary">{teacher.department}</span>
          </p>
          <span className={`badge ${teacher.statusBadge} d-inline-flex align-items-center`}>
            <i className="ti ti-circle-filled fs-8 me-1" />
            {teacher.status}
          </span>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 mb-3">
        <Link to={routes.chat} className="btn btn-outline-light bg-white btn-sm flex-fill">
          <i className="ti ti-message me-1" />
          Message
        </Link>
        <Link to={routes.audioCall} className="btn btn-outline-light bg-white btn-sm flex-fill">
          <i className="ti ti-phone me-1" />
          Call
        </Link>
        <Link to={routes.editTeacher} className="btn btn-primary btn-sm flex-fill">
          <i className="ti ti-edit me-1" />
          Edit
        </Link>
      </div>

      <div className="accordion accordion-flush" id="teacher_profile_acc">
        {profileSections.map((section, index) => {
          const expanded = open === section.id;
          const last = index === profileSections.length - 1;
          return (
            <div className={`accordion-item border rounded ${last ? 'mb-0' : 'mb-2'}`} key={section.id}>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button${expanded ? '' : ' collapsed'} rounded`}
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={section.id}
                  onClick={() => setOpen(expanded ? '' : section.id)}
                >
                  <i className={`${section.icon} me-2`} />
                  {section.label}
                </button>
              </h2>
              <div id={section.id} className={`accordion-collapse collapse${expanded ? ' show' : ''}`}>
                <div className="accordion-body">{bodies[section.id]}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Offcanvas>
  );
};

export default TeacherProfilePanel;
