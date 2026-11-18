import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import { all_routes } from '@/routes/all_routes';
import type { TeacherCard } from '../data/teachers.data';
import { profileSections } from '../data/teachersWorkspace.data';

const routes = all_routes;

// Only the sections that have real data behind them.
const LIVE_SECTIONS = new Set(['tp_info', 'tp_prof', 'tp_classes', 'tp_subjects', 'tp_contact', 'tp_qual', 'tp_exp']);

export interface TeacherProfilePanelProps {
  teacher: TeacherCard | null;
  onClose: () => void;
}

const Empty = ({ children }: { children: string }) => <p className="text-muted mb-0">{children}</p>;

const TeacherProfilePanel = ({ teacher, onClose }: TeacherProfilePanelProps) => {
  const [open, setOpen] = useState('tp_info');

  // Every card opens the panel on its first section.
  useEffect(() => {
    if (teacher) setOpen('tp_info');
  }, [teacher]);

  if (!teacher) return null;

  const bodies: Record<string, React.ReactNode> = {
    tp_info: (
      <div className="row g-3">
        <div className="col-6">
          <p className="mb-0 fs-12">Employee ID</p>
          <p className="text-dark mb-0">{teacher.id}</p>
        </div>
        <div className="col-6">
          <p className="mb-0 fs-12">Joining Date</p>
          <p className="text-dark mb-0">{teacher.joined}</p>
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
          <p className="mb-0 fs-12">Employment Type</p>
          <p className="text-dark mb-0">{teacher.employment.label}</p>
        </div>
        <div className="col-6">
          <p className="mb-0 fs-12">Experience</p>
          <p className="text-dark mb-0">{teacher.experience}</p>
        </div>
      </div>
    ),
    tp_classes:
      teacher.sections.length > 0 ? (
        <div className="d-flex flex-wrap gap-2">
          {teacher.sections.map((section) => (
            <span className="badge badge-soft-primary" key={section}>
              {section}
            </span>
          ))}
        </div>
      ) : (
        <Empty>No classes assigned yet.</Empty>
      ),
    tp_subjects:
      teacher.subjectNames.length > 0 ? (
        <div className="d-flex flex-wrap gap-2">
          {teacher.subjectNames.map((subject) => (
            <span className="badge badge-soft-info" key={subject}>
              {subject}
            </span>
          ))}
        </div>
      ) : (
        <Empty>No subjects assigned yet.</Empty>
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
          {teacher.address}
        </p>
      </>
    ),
    tp_qual: (
      <p className="mb-0">
        <i className="ti ti-school text-primary me-2" />
        {teacher.qualification}
      </p>
    ),
    tp_exp: (
      <p className="mb-0">
        <i className="ti ti-timeline text-primary me-2" />
        {teacher.experience}
      </p>
    ),
  };

  const sections = profileSections.filter((section) => LIVE_SECTIONS.has(section.id));

  return (
    <Offcanvas open onClose={onClose} title="Teacher Profile" labelledById="teacher_profile_label">
      <div className="d-flex align-items-center mb-3">
        <span className="avatar avatar-xl flex-shrink-0 me-3 rounded-circle bg-light fw-bold text-dark d-flex align-items-center justify-content-center">
          {teacher.initials}
        </span>
        <div>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
            <h5 className="mb-0">{teacher.name}</h5>
            <span className={`badge ${teacher.employment.className}`}>{teacher.employment.label}</span>
          </div>
          <p className="mb-1">
            <span className="link-primary">{teacher.id}</span>
          </p>
          <span className={`badge ${teacher.statusBadge} d-inline-flex align-items-center`}>
            <i className="ti ti-circle-filled fs-8 me-1" />
            {teacher.status}
          </span>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 mb-3">
        <Link to={`${routes.teacherDetails}?id=${teacher.key}`} className="btn btn-outline-light bg-white btn-sm flex-fill">
          <i className="ti ti-user me-1" />
          Full Profile
        </Link>
        <Link to={`${routes.editTeacher}?id=${teacher.key}`} className="btn btn-primary btn-sm flex-fill">
          <i className="ti ti-edit me-1" />
          Edit
        </Link>
      </div>

      <div className="accordion accordion-flush" id="teacher_profile_acc">
        {sections.map((section, index) => {
          const expanded = open === section.id;
          const last = index === sections.length - 1;
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