import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { GuardianRecord } from '../data/guardians.data';

const routes = all_routes;

type SectionId = 'info' | 'students' | 'contact' | 'emergency' | 'occupation' | 'address' | 'comm' | 'activity' | 'docs';

const sections: { id: SectionId; label: string; icon: string }[] = [
  { id: 'info', label: 'Guardian Information', icon: 'ti ti-user-circle' },
  { id: 'students', label: 'Student Information', icon: 'ti ti-school' },
  { id: 'contact', label: 'Contact Details', icon: 'ti ti-address-book' },
  { id: 'emergency', label: 'Emergency Contacts', icon: 'ti ti-urgent' },
  { id: 'occupation', label: 'Occupation', icon: 'ti ti-briefcase' },
  { id: 'address', label: 'Address', icon: 'ti ti-map-pin' },
  { id: 'comm', label: 'Communication History', icon: 'ti ti-message-2' },
  { id: 'activity', label: 'Recent Activities', icon: 'ti ti-activity' },
  { id: 'docs', label: 'Uploaded Documents', icon: 'ti ti-files' },
];

export interface GuardianPreviewPanelProps {
  guardian: GuardianRecord | null;
  onClose: () => void;
  onEdit: (id: string) => void;
}

const GuardianPreviewPanel = ({ guardian, onClose, onEdit }: GuardianPreviewPanelProps) => {
  const [open, setOpen] = useState<SectionId | null>('info');

  // The template always reopens on the first section when a new guardian is shown.
  useEffect(() => {
    if (guardian) setOpen('info');
  }, [guardian]);

  if (!guardian) return null;

  const g = guardian;
  /** `Janet, Joann` → one row per student, paired with its class label. */
  const studentNames = g.students.names.split(', ');
  const studentClasses = g.students.classes.split(', ');

  const body = (id: SectionId) => {
    switch (id) {
      case 'info':
        return (
          <div className="row g-3">
            <div className="col-6">
              <p className="mb-0 fs-12">Guardian ID</p>
              <p className="text-dark mb-0">{g.id}</p>
            </div>
            <div className="col-6">
              <p className="mb-0 fs-12">Relationship</p>
              <p className="text-dark mb-0">{g.relationship}</p>
            </div>
            <div className="col-6">
              <p className="mb-0 fs-12">Branch</p>
              <p className="text-dark mb-0">{g.branch}</p>
            </div>
            <div className="col-6">
              <p className="mb-0 fs-12">Created Date</p>
              <p className="text-dark mb-0">{g.createdDate}</p>
            </div>
            <div className="col-6">
              <p className="mb-0 fs-12">Last Login</p>
              <p className="text-dark mb-0">{g.lastLogin.replace('Last login ', '')}</p>
            </div>
            <div className="col-6">
              <p className="mb-0 fs-12">Status</p>
              <p className="text-dark mb-0">{g.status}</p>
            </div>
          </div>
        );

      case 'students':
        return studentNames.map((name, index) => (
          <div
            className={`d-flex align-items-center justify-content-between${
              index === studentNames.length - 1 ? '' : ' mb-3'
            }`}
            key={name}
          >
            <div className="d-flex align-items-center">
              <Link to={routes.studentDetail} className="avatar avatar-md me-2">
                <ImageWithBasePath src={g.students.avatar} className="rounded-circle flex-shrink-0" alt={name} />
              </Link>
              <div>
                <p className="text-dark mb-0">{name}</p>
                <span className="fs-12 text-muted">
                  Class {studentClasses[index] ?? studentClasses[0]} · Roll {35010 + index * 2}
                </span>
              </div>
            </div>
            <span className="badge badge-soft-success">Active</span>
          </div>
        ));

      case 'contact':
        return (
          <>
            <p className="mb-2">
              <i className="ti ti-phone text-muted me-2" />
              {g.phone}
            </p>
            <p className="mb-2">
              <i className="ti ti-mail text-muted me-2" />
              {g.email}
            </p>
            <p className="mb-0">
              <i className="ti ti-brand-whatsapp text-muted me-2" />
              {g.phone}
            </p>
          </>
        );

      case 'emergency':
        return (
          <>
            <p className="mb-1 text-dark">{g.name.split(' ').slice(-1)[0]} family contact (Spouse)</p>
            <p className="mb-0">
              <i className="ti ti-phone text-muted me-2" />
              {g.emergencyPhone}
            </p>
          </>
        );

      case 'occupation':
        return (
          <div className="row g-3">
            <div className="col-6">
              <p className="mb-0 fs-12">Designation</p>
              <p className="text-dark mb-0">{g.occupation}</p>
            </div>
            <div className="col-6">
              <p className="mb-0 fs-12">Organization</p>
              <p className="text-dark mb-0">Springfield Infra Ltd.</p>
            </div>
          </div>
        );

      case 'address':
        return <p className="mb-0 text-dark">{g.address}, IL 62704, United States</p>;

      case 'comm':
        return (
          <>
            <div className="d-flex mb-3">
              <span className="avatar avatar-sm bg-soft-info text-info rounded-circle flex-shrink-0">
                <i className="ti ti-mail" />
              </span>
              <div className="ms-2">
                <p className="mb-0 fs-13 text-dark">Fee reminder email sent</p>
                <span className="fs-12 text-muted">20 Jul 2026</span>
              </div>
            </div>
            <div className="d-flex mb-0">
              <span className="avatar avatar-sm bg-soft-success text-success rounded-circle flex-shrink-0">
                <i className="ti ti-message" />
              </span>
              <div className="ms-2">
                <p className="mb-0 fs-13 text-dark">PTM confirmation SMS delivered</p>
                <span className="fs-12 text-muted">15 Jul 2026</span>
              </div>
            </div>
          </>
        );

      case 'activity':
        return (
          <ul className="list-unstyled mb-0">
            <li className="mb-2">
              <i className="ti ti-login text-primary me-2" />
              Logged in via mobile app <span className="fs-12 text-muted">· {g.lastLogin.replace('Last login ', '')}</span>
            </li>
            <li className="mb-2">
              <i className="ti ti-report-money text-success me-2" />
              Paid Term-1 fees <span className="fs-12 text-muted">· 2 days ago</span>
            </li>
            <li className="mb-0">
              <i className="ti ti-calendar-check text-info me-2" />
              Confirmed PTM attendance <span className="fs-12 text-muted">· 5 days ago</span>
            </li>
          </ul>
        );

      case 'docs':
      default:
        return (
          <>
            <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-2">
              <span className="text-dark">
                <i className="ti ti-file-type-pdf text-danger me-2" />
                ID_Proof.pdf
              </span>
              <button type="button" className="btn btn-icon btn-sm btn-outline-light bg-white" aria-label="Download">
                <i className="ti ti-download" />
              </button>
            </div>
            <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-0">
              <span className="text-dark">
                <i className="ti ti-file-type-jpg text-info me-2" />
                Address_Proof.jpg
              </span>
              <button type="button" className="btn btn-icon btn-sm btn-outline-light bg-white" aria-label="Download">
                <i className="ti ti-download" />
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <Offcanvas
      open
      onClose={onClose}
      title="Guardian Profile"
      labelledById="guardian_profile_label"
      className="guardian-profile-panel"
    >
      <div className="d-flex align-items-center mb-3">
        <span className={`avatar avatar-xl flex-shrink-0 me-3${g.online ? ' online' : ''}`}>
          <ImageWithBasePath src={g.avatar} className="rounded-circle flex-shrink-0" alt={g.name} />
        </span>
        <div>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
            <h5 className="mb-0">{g.name}</h5>
            {g.vip ? (
              <span className="badge badge-soft-purple d-inline-flex align-items-center">
                <i className="ti ti-crown me-1" />
                VIP
              </span>
            ) : null}
          </div>
          <p className="mb-1">
            <span className="link-primary">{g.id}</span> ·{' '}
            <span className={`badge ${g.relationshipBadgeClass}`}>{g.relationship}</span>
          </p>
          <span className={`badge ${g.statusBadgeClass} d-inline-flex align-items-center`}>
            <i className="ti ti-circle-filled fs-8 me-1" />
            {g.status}
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
        <button type="button" className="btn btn-primary btn-sm flex-fill" onClick={() => onEdit(g.id)}>
          <i className="ti ti-edit me-1" />
          Edit
        </button>
      </div>

      <div className="accordion accordion-flush" id="guardian_profile_acc">
        {sections.map((section, index) => (
          <div
            className={`accordion-item border rounded${index === sections.length - 1 ? ' mb-0' : ' mb-2'}`}
            key={section.id}
          >
            <h2 className="accordion-header">
              <button
                type="button"
                className={`accordion-button rounded${open === section.id ? '' : ' collapsed'}`}
                aria-expanded={open === section.id}
                onClick={() => setOpen((current) => (current === section.id ? null : section.id))}
              >
                <i className={`${section.icon} me-2`} />
                {section.label}
              </button>
            </h2>
            <div className={`accordion-collapse collapse${open === section.id ? ' show' : ''}`}>
              <div className="accordion-body">{body(section.id)}</div>
            </div>
          </div>
        ))}
      </div>
    </Offcanvas>
  );
};

export default GuardianPreviewPanel;
