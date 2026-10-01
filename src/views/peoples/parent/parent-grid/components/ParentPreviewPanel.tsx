import { useState } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ParentRecord } from '../data/parents.data';

const routes = all_routes;

type SectionId = 'info' | 'students' | 'contact' | 'emergency' | 'occ' | 'addr' | 'comm' | 'activities' | 'docs';

const sections: { id: SectionId; icon: string; title: string }[] = [
  { id: 'info', icon: 'ti ti-user-circle', title: 'Parent Information' },
  { id: 'students', icon: 'ti ti-school', title: 'Student Information' },
  { id: 'contact', icon: 'ti ti-address-book', title: 'Contact Details' },
  { id: 'emergency', icon: 'ti ti-urgent', title: 'Emergency Contacts' },
  { id: 'occ', icon: 'ti ti-briefcase', title: 'Occupation' },
  { id: 'addr', icon: 'ti ti-map-pin', title: 'Address' },
  { id: 'comm', icon: 'ti ti-message-2', title: 'Communication History' },
  { id: 'activities', icon: 'ti ti-activity', title: 'Recent Activities' },
  { id: 'docs', icon: 'ti ti-files', title: 'Uploaded Documents' },
];

export interface ParentPreviewPanelProps {
  parent: ParentRecord | null;
  onClose: () => void;
  onEdit: (id: string) => void;
}

const ParentPreviewPanel = ({ parent, onClose, onEdit }: ParentPreviewPanelProps) => {
  const [open, setOpen] = useState<SectionId>('info');

  return (
    <Offcanvas open={parent !== null} onClose={onClose} title="Parent Profile" labelledById="parent_profile_label">
      {parent ? (
        <>
          <div className="d-flex align-items-center mb-3">
            <span className={`avatar avatar-xl flex-shrink-0 me-3${parent.online ? ' online' : ''}`}>
              <ImageWithBasePath src={parent.avatar} className="rounded-circle flex-shrink-0" alt={parent.name} />
            </span>
            <div>
              <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                <h5 className="mb-0">{parent.name}</h5>
                {parent.vip ? (
                  <span className="badge badge-soft-purple d-inline-flex align-items-center">
                    <i className="ti ti-crown me-1" />
                    VIP
                  </span>
                ) : null}
              </div>
              <p className="mb-1">
                <span className="link-primary">{parent.id}</span> · <span className={`badge ${parent.relationBadgeClass}`}>{parent.relation}</span>
              </p>
              <span className={`badge ${parent.statusBadgeClass} d-inline-flex align-items-center`}>
                <i className="ti ti-circle-filled fs-8 me-1" />
                {parent.status}
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
            <button type="button" className="btn btn-primary btn-sm flex-fill" onClick={() => onEdit(parent.id)}>
              <i className="ti ti-edit me-1" />
              Edit
            </button>
          </div>

          <div className="accordion accordion-flush" id="parent_profile_acc">
            {sections.map((section) => (
              <div className="accordion-item border rounded mb-2" key={section.id}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button rounded${open === section.id ? '' : ' collapsed'}`}
                    type="button"
                    onClick={() => setOpen(section.id)}
                  >
                    <i className={`${section.icon} me-2`} />
                    {section.title}
                  </button>
                </h2>
                <div className={`accordion-collapse collapse${open === section.id ? ' show' : ''}`}>
                  <div className="accordion-body">
                    {section.id === 'info' ? (
                      <div className="row g-3">
                        <div className="col-6">
                          <p className="mb-0 fs-12">Parent ID</p>
                          <p className="text-dark mb-0">{parent.id}</p>
                        </div>
                        <div className="col-6">
                          <p className="mb-0 fs-12">Relationship</p>
                          <p className="text-dark mb-0">{parent.relation}</p>
                        </div>
                        <div className="col-6">
                          <p className="mb-0 fs-12">Branch</p>
                          <p className="text-dark mb-0">{parent.branch}</p>
                        </div>
                        <div className="col-6">
                          <p className="mb-0 fs-12">Created Date</p>
                          <p className="text-dark mb-0">{parent.joined}</p>
                        </div>
                        <div className="col-6">
                          <p className="mb-0 fs-12">Last Login</p>
                          <p className="text-dark mb-0">{parent.lastLogin}</p>
                        </div>
                        <div className="col-6">
                          <p className="mb-0 fs-12">Status</p>
                          <p className="text-dark mb-0">{parent.status}</p>
                        </div>
                      </div>
                    ) : null}

                    {section.id === 'students'
                      ? parent.children.map((child) => (
                          <div className="d-flex align-items-center justify-content-between mb-3" key={child.name}>
                            <div className="d-flex align-items-center">
                              <Link to={routes.studentDetail} className="avatar avatar-md me-2">
                                <ImageWithBasePath src={child.avatar} className="rounded-circle flex-shrink-0" alt={child.name} />
                              </Link>
                              <div>
                                <p className="text-dark mb-0">{child.name}</p>
                                <span className="fs-12 text-muted">Class {child.classLabel}</span>
                              </div>
                            </div>
                            <span className="badge badge-soft-success">Active</span>
                          </div>
                        ))
                      : null}

                    {section.id === 'contact' ? (
                      <>
                        <p className="mb-2">
                          <i className="ti ti-phone text-muted me-2" />
                          {parent.phone}
                        </p>
                        <p className="mb-2">
                          <i className="ti ti-mail text-muted me-2" />
                          {parent.email}
                        </p>
                        <p className="mb-0">
                          <i className="ti ti-brand-whatsapp text-muted me-2" />
                          {parent.phone}
                        </p>
                      </>
                    ) : null}

                    {section.id === 'emergency' ? (
                      <>
                        <p className="mb-1 text-dark">{parent.emergencyContact}</p>
                        <p className="mb-0">
                          <i className="ti ti-phone text-muted me-2" />
                          {parent.emergencyPhone}
                        </p>
                      </>
                    ) : null}

                    {section.id === 'occ' ? (
                      <div className="row g-3">
                        <div className="col-6">
                          <p className="mb-0 fs-12">Designation</p>
                          <p className="text-dark mb-0">{parent.occupation}</p>
                        </div>
                        <div className="col-6">
                          <p className="mb-0 fs-12">Organization</p>
                          <p className="text-dark mb-0">{parent.organization}</p>
                        </div>
                      </div>
                    ) : null}

                    {section.id === 'addr' ? <p className="mb-0 text-dark">{parent.address}</p> : null}

                    {section.id === 'comm' ? (
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
                    ) : null}

                    {section.id === 'activities' ? (
                      <ul className="list-unstyled mb-0">
                        <li className="mb-2">
                          <i className="ti ti-login text-primary me-2" />
                          Logged in via mobile app <span className="fs-12 text-muted">· {parent.lastLogin}</span>
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
                    ) : null}

                    {section.id === 'docs' ? (
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
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </Offcanvas>
  );
};

export default ParentPreviewPanel;
