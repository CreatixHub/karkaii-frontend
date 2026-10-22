import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { DepartmentInfoKey, DepartmentModalId, DepartmentRow } from '../data/departments.data';
import { assignedStaff, departmentInfoFields, departmentSubjects, detailActions, detailMenuItems } from '../data/departments.data';

export interface DepartmentDetailProps {
  department: DepartmentRow;
  onModal: (modal: DepartmentModalId, department: DepartmentRow) => void;
  onAction: (action: string, department: DepartmentRow) => void;
}

const DepartmentDetail = ({ department, onModal, onAction }: DepartmentDetailProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const d = department;
  const infoValue = (key: DepartmentInfoKey) => String(d[key]);

  return (
    <div className="dept-pane" id={d.id}>
      <div className="card mb-0 dept-detail">
        <div className={`p-4 bg-${d.tone}-transparent rounded-top`}>
          <div className="d-flex flex-wrap gap-3 align-items-start justify-content-between">
            <div className="d-flex align-items-center mb-3 mb-xl-0">
              <span className={`avatar avatar-xl bg-white text-${d.tone} rounded me-3 flex-shrink-0`}>
                <i className={`${d.icon} fs-28`} />
              </span>
              <div>
                <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                  <h4 className="mb-0">{d.name}</h4>
                  <span className={`badge bg-${d.tone}-transparent text-${d.tone}`}>{d.code}</span>
                  <span
                    className={`badge ${
                      d.status === 'Active' ? 'badge-soft-success' : 'badge-soft-danger'
                    } d-inline-flex align-items-center`}
                  >
                    <i className="ti ti-circle-filled fs-5 me-1" />
                    {d.status}
                  </span>
                </div>
                <p className="mb-0 text-muted">{d.description}</p>
              </div>
            </div>

            <div className="d-flex align-items-center flex-wrap gap-1">
              {detailActions.map((action) => (
                <Link
                  key={action.id}
                  to="#"
                  className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                  title={action.title}
                  aria-label={action.title}
                  onClick={() => (action.modal ? onModal(action.modal, d) : onAction(action.action ?? action.id, d))}
                >
                  <i className={action.icon} />
                </Link>
              ))}
              <div className="dropdown" ref={menuRef}>
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                  aria-label="More"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <i className="ti ti-dots-vertical" />
                </Link>
                <ul className={`dropdown-menu dropdown-menu-end p-2${menuOpen ? ' show' : ''}`}>
                  {detailMenuItems.map((item) => (
                    <li key={item.id}>
                      <Link
                        className={`dropdown-item rounded-1${item.danger ? ' text-danger' : ''}`}
                        to="#"
                        onClick={() => {
                          setMenuOpen(false);
                          if (item.modal) onModal(item.modal, d);
                          else onAction(item.action ?? item.id, d);
                        }}
                      >
                        <i className={`${item.icon} me-2`} />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <h5 className="mb-3 fs-15">Department Information</h5>
          <div className="row g-3 mb-4">
            {departmentInfoFields.map((field) => (
              <div className="col-md-6 col-xl-4" key={field.key}>
                <div className="d-flex align-items-center">
                  <span
                    className={`avatar avatar-md bg-${field.tone}-transparent text-${field.tone} rounded me-2 flex-shrink-0`}
                  >
                    <i className={`${field.icon} fs-20`} />
                  </span>
                  <div className="overflow-hidden">
                    <p className="fs-12 text-muted mb-0">{field.label}</p>
                    <p className="mb-0 fw-medium text-dark text-truncate">{infoValue(field.key)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="mb-0">Assigned Staff</h6>
            <Link
              to="#"
              className="btn btn-sm btn-outline-light bg-white"
              onClick={() => onModal('assign_staff', d)}
            >
              <i className="ti ti-user-plus me-1" />
              Assign
            </Link>
          </div>
          <div className="row g-3 mb-4">
            {assignedStaff.map((staff) => (
              <div className="col-6" key={staff.name}>
                <div className="card card-hover mb-0 h-100">
                  <div className="card-body text-center">
                    <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                      <ImageWithBasePath src={staff.avatar} className="rounded-circle flex-shrink-0" alt={staff.name} />
                    </span>
                    <h6 className="mb-0 text-truncate">{staff.name}</h6>
                    <span className="fs-12 text-muted d-block mb-2">{staff.role}</span>
                    <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                      <span className="badge badge-soft-primary">{staff.subject}</span>
                      <span className={`badge ${staff.statusClass}`}>{staff.status}</span>
                    </div>
                    <a href={`tel:${staff.tel}`} className="fs-12 text-muted d-inline-flex align-items-center">
                      <i className="ti ti-phone me-1" />
                      {staff.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="mb-0">Subjects</h6>
            <Link
              to="#"
              className="btn btn-sm btn-outline-light bg-white"
              onClick={() => onModal('assign_subjects', d)}
            >
              <i className="ti ti-book me-1" />
              Assign
            </Link>
          </div>
          <div className="row g-3">
            {departmentSubjects.map((subject) => (
              <div className="col-sm-6 col-xl-4" key={subject.code}>
                <div className="border rounded p-3 d-flex align-items-center">
                  <span
                    className={`avatar avatar-md bg-${subject.tone}-transparent text-${subject.tone} rounded me-2 flex-shrink-0`}
                  >
                    <i className="ti ti-book fs-20" />
                  </span>
                  <div className="overflow-hidden">
                    <p className="mb-0 fw-medium text-dark text-truncate">{subject.name}</p>
                    <span className="fs-12 text-muted">
                      {subject.code} · {subject.teachers} Teachers
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;
