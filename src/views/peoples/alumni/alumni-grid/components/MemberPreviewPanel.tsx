import ImageWithBasePath from '@core/common/imageWithBasePath';
import Offcanvas from '@components/ui/Offcanvas';
import type { MemberTile } from '../data/alumni.data';

export interface MemberPreviewPanelProps {
  member: MemberTile | null;
  onClose: () => void;
  onMessage: () => void;
  onEdit: () => void;
  onConnect: () => void;
  onRequestMentor: () => void;
  onSaveNote: () => void;
  onOpenRelated: (name: string) => void;
}

const MemberPreviewPanel = ({
  member,
  onClose,
  onMessage,
  onEdit,
  onConnect,
  onRequestMentor,
  onSaveNote,
  onOpenRelated,
}: MemberPreviewPanelProps) => {
  if (!member) return null;
  const profile = member.profile;

  return (
    <Offcanvas
      open={member !== null}
      onClose={onClose}
      title={member.name}
      labelledById="alx_member_label"
      className="detail-panel"
      footer={null}
    >
      <div className="row g-0 gx-4">
        {/* header identity + actions, rendered inline since Offcanvas owns its own header */}
        <div className="col-12 d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div className="d-flex align-items-center gap-2">
            <ImageWithBasePath src={member.avatar} alt={member.name} className="rounded-circle" width={48} height={48} />
            <div>
              <h6 className="mb-0">{member.name}</h6>
              <p className="fs-12 text-muted mb-0">
                {member.role.split(' · ')[0]} at {member.company} · {member.batchLabel} · {member.country}
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button type="button" className="btn btn-outline-light bg-white btn-sm fw-medium d-none d-md-inline-flex align-items-center" onClick={onMessage}>
              <i className="ti ti-message-2 me-1" />
              Message
            </button>
            <button type="button" className="btn btn-outline-light bg-white btn-sm fw-medium d-none d-md-inline-flex align-items-center" onClick={onEdit}>
              <i className="ti ti-edit me-1" />
              Edit
            </button>
            <button type="button" className="btn btn-primary btn-sm d-inline-flex align-items-center" onClick={onConnect}>
              <i className="ti ti-user-plus me-1" />
              Connect
            </button>
          </div>
        </div>

        {/* Left column */}
        <div className="col-12 col-xl-8">
          <div className="panel">
            <div className="panel-header">
              <h6>
                <i className="ti ti-user-circle" />
                Profile
              </h6>
              <span className="status-badge is-accent">
                <i className="ti ti-discount" />
                Verified alumnus
              </span>
            </div>
            <div className="panel-body">
              <div className="facts mb-3">
                <div className="fact">
                  <span className="metric-label">Graduation year</span>
                  <p>{profile.graduationYear}</p>
                </div>
                <div className="fact">
                  <span className="metric-label">Department</span>
                  <p>{profile.department}</p>
                </div>
                <div className="fact">
                  <span className="metric-label">Profession</span>
                  <p>{profile.profession}</p>
                </div>
                <div className="fact">
                  <span className="metric-label">Industry</span>
                  <p>{profile.industry}</p>
                </div>
                <div className="fact">
                  <span className="metric-label">Country</span>
                  <p>{profile.country}</p>
                </div>
                <div className="fact">
                  <span className="metric-label">Chapter</span>
                  <p>{profile.chapter}</p>
                </div>
                <div className="fact">
                  <span className="metric-label">Email</span>
                  <p>{profile.email}</p>
                </div>
                <div className="fact">
                  <span className="metric-label">Member since</span>
                  <p>{profile.memberSince}</p>
                </div>
              </div>
              <p className="fs-13 text-muted mb-0">{profile.bio}</p>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h6>
                <i className="ti ti-school" />
                Education
              </h6>
            </div>
            <div className="panel-body is-flush">
              <div className="journey">
                {profile.educationJourney.map((item) => (
                  <div className="job" key={item.title}>
                    <span className="job-logo">
                      <i className={item.icon} />
                    </span>
                    <div>
                      <h6>{item.title}</h6>
                      <p className="job-org">{item.org}</p>
                    </div>
                    <span className="job-span">{item.span}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h6>
                <i className="ti ti-briefcase" />
                Professional Journey
              </h6>
            </div>
            <div className="panel-body is-flush">
              <div className="journey">
                {profile.professionalJourney.map((item) => (
                  <div className={`job${item.current ? ' is-current' : ''}`} key={item.title}>
                    <span className="job-logo">
                      <i className={item.icon} />
                    </span>
                    <div>
                      <h6>{item.title}</h6>
                      <p className="job-org">{item.org}</p>
                      {item.current ? (
                        <span className="status-badge is-open">
                          <i className="ti ti-circle-filled" />
                          Current role
                        </span>
                      ) : null}
                    </div>
                    <span className="job-span">{item.span}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h6>
                <i className="ti ti-trophy" />
                Achievements
              </h6>
            </div>
            <div className="panel-body">
              {profile.achievements.map((item) => (
                <div className="award" key={item.title}>
                  <i className={item.icon} />
                  <div>
                    <b>{item.title}</b>
                    <small>{item.detail}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h6>
                <i className="ti ti-calendar-event" />
                Events
              </h6>
              <span className="fs-12 text-muted">{profile.eventsSummary}</span>
            </div>
            <div className="panel-body is-flush">
              {profile.eventHistory.map((item) => (
                <div className="related-item" key={item.title}>
                  <span className="resource-icon">
                    <i className={item.icon} />
                  </span>
                  <div className="related-main">
                    <b>{item.title}</b>
                    <small>{item.detail}</small>
                  </div>
                  <span className={`status-badge${item.statusClass ? ` ${item.statusClass}` : ''}`}>{item.statusLabel}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h6>
                <i className="ti ti-photo" />
                Gallery
              </h6>
              <a href="#" className="fs-12 link-primary" onClick={(event) => event.preventDefault()}>
                View album
              </a>
            </div>
            <div className="panel-body">
              <div className="gallery">
                {profile.gallery.map((image) => (
                  <ImageWithBasePath src={image.src} alt={image.alt} key={image.src} />
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h6>
                <i className="ti ti-notes" />
                Notes
              </h6>
              <span className="status-badge">Internal only</span>
            </div>
            <div className="panel-body">
              {profile.notes.map((note) => (
                <div className="note-item" key={note.text}>
                  <p>{note.text}</p>
                  <span className="note-by">{note.by}</span>
                </div>
              ))}
              <div className="mt-3">
                <textarea className="form-control" rows={2} placeholder="Add an internal note…" aria-label="Add an internal note…" />
                <div className="d-flex justify-content-end mt-2">
                  <button type="button" className="btn btn-primary btn-sm" onClick={onSaveNote}>
                    Save note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-12 col-xl-4">
          <div className="panel">
            <div className="panel-header">
              <h6>
                <i className="ti ti-bulb" />
                Skills
              </h6>
            </div>
            <div className="panel-body">
              <div className="d-flex flex-wrap gap-1">
                {profile.skills.map((skill, index) => (
                  <span className={index === 0 ? 'member-tag is-accent' : 'member-tag'} key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h6>
                <i className="ti ti-compass" />
                Mentorship
              </h6>
              <span className="availability is-free">{profile.mentorship.slotsLabel}</span>
            </div>
            <div className="panel-body">
              <div className="intents mb-3">
                <span className={`intent${member.intents.mentor ? ' is-on is-mentor' : ''}`}>
                  <i className="ti ti-compass" />
                  Mentor
                </span>
                <span className={`intent${member.intents.recruit ? ' is-on is-recruit' : ''}`}>
                  <i className="ti ti-briefcase" />
                  {member.intents.recruit ? 'Recruiting' : 'Recruit'}
                </span>
                <span className={`intent${member.intents.speak ? ' is-on is-speak' : ''}`}>
                  <i className="ti ti-microphone-2" />
                  {member.intents.speak ? 'Speaker' : 'Speak'}
                </span>
              </div>
              <div className="facts mb-3">
                <div className="fact">
                  <span className="metric-label">Format</span>
                  <p>{profile.mentorship.format}</p>
                </div>
                <div className="fact">
                  <span className="metric-label">Focus</span>
                  <p>{profile.mentorship.focus}</p>
                </div>
                <div className="fact">
                  <span className="metric-label">Mentees to date</span>
                  <p>{profile.mentorship.mentees}</p>
                </div>
                <div className="fact">
                  <span className="metric-label">Preferred grades</span>
                  <p>{profile.mentorship.grades}</p>
                </div>
              </div>
              <button type="button" className="btn btn-primary btn-sm w-100" onClick={onRequestMentor}>
                Request as mentor
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h6>
                <i className="ti ti-heart-handshake" />
                Community Participation
              </h6>
            </div>
            <div className="panel-body">
              <div className="tally mb-3">
                <div className="tally-cell">
                  <b>{profile.participation.connections}</b>
                  <small>Connections</small>
                </div>
                <div className="tally-cell">
                  <b>{profile.participation.events}</b>
                  <small>Events</small>
                </div>
                <div className="tally-cell">
                  <b>{profile.participation.mentees}</b>
                  <small>Mentees</small>
                </div>
                <div className="tally-cell">
                  <b>{profile.participation.opportunities}</b>
                  <small>Opportunities</small>
                </div>
              </div>
              <div className="facts">
                <div className="fact">
                  <span className="metric-label">Chapter role</span>
                  <p>{profile.participation.chapterRole}</p>
                </div>
                <div className="fact">
                  <span className="metric-label">Last active</span>
                  <p>{profile.participation.lastActive}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h6>
                <i className="ti ti-link" />
                Social Links
              </h6>
            </div>
            <div className="panel-body">
              <div className="social">
                <a href="#" onClick={(event) => event.preventDefault()}>
                  <i className="ti ti-brand-linkedin" />
                  LinkedIn
                </a>
                <a href="#" onClick={(event) => event.preventDefault()}>
                  <i className="ti ti-brand-github" />
                  GitHub
                </a>
                <a href="#" onClick={(event) => event.preventDefault()}>
                  <i className="ti ti-brand-x" />
                  X
                </a>
                <a href="#" onClick={(event) => event.preventDefault()}>
                  <i className="ti ti-world" />
                  Website
                </a>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h6>
                <i className="ti ti-users" />
                Related Alumni
              </h6>
              <span className="fs-12 text-muted">Same batch &amp; field</span>
            </div>
            <div className="panel-body is-flush">
              {profile.related.map((person) => (
                <div className="related-item" key={person.name}>
                  <ImageWithBasePath src={person.avatar} alt="" />
                  <div className="related-main">
                    <b>{person.name}</b>
                    <small>{person.meta}</small>
                  </div>
                  <button type="button" className="icon-button" aria-label="Open" onClick={() => onOpenRelated(person.name)}>
                    <i className="ti ti-arrow-right" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Offcanvas>
  );
};

export default MemberPreviewPanel;
