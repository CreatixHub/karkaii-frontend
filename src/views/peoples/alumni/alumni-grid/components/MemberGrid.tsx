import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { MemberTile } from '../data/alumni.data';

export interface MemberGridProps {
  members: MemberTile[];
  onOpenProfile: (member: MemberTile) => void;
  onViewAll: () => void;
}

const MemberGrid = ({ members, onOpenProfile, onViewAll }: MemberGridProps) => (
  <>
    <div className="section-header">
      <div>
        <h4 className="section-title fs-16 fw-medium">Alumni Network</h4>
        <p className="section-subtitle">Members who have opted in to help the school community</p>
      </div>
      <span className="section-rule" />
      <button
        type="button"
        className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center flex-shrink-0"
        onClick={onViewAll}
      >
        View all alumni
        <i className="ti ti-arrow-right ms-1" />
      </button>
    </div>

    {members.length > 0 ? (
      <div className="row g-3 mb-4">
        {members.map((member) => (
          <div className="col-12 col-xxl-4 col-xl-6 d-flex" key={member.id}>
            <div className="tile">
              <div className="tile-band">
                <span className="tile-batch">{member.batchLabel}</span>
              </div>
              <div className="tile-identity">
                <ImageWithBasePath src={member.avatar} className="tile-avatar" alt={member.name} />
                {member.showActiveDot ? <span className="tile-dot" title="Active this week" /> : <span className="tile-dot" />}
                <div>
                  <h5 className="tile-name fs-15">
                    <a
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        onOpenProfile(member);
                      }}
                    >
                      {member.name}
                    </a>
                  </h5>
                  <p className="tile-role">{member.role}</p>
                </div>
              </div>
              <div className="tile-body">
                <div className="tile-facts">
                  <div>
                    <span className="metric-label">Company</span>
                    <p>{member.company}</p>
                  </div>
                  <div>
                    <span className="metric-label">Industry</span>
                    <p>{member.industry}</p>
                  </div>
                  <div>
                    <span className="metric-label">Country</span>
                    <p>{member.country}</p>
                  </div>
                </div>
                <div className="intents">
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
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {member.tags.map((tag) => (
                    <span className="member-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="tile-note">
                  <i className="ti ti-award" />
                  {member.note}
                </p>
              </div>
              <div className="tile-footer">
                <div className="tile-connections">
                  <span className="avatar-stack">
                    {member.connectionAvatars.map((avatar) => (
                      <ImageWithBasePath src={avatar} alt="" key={avatar} />
                    ))}
                    <span className="more">+{member.extraConnections}</span>
                  </span>
                  <span>{member.connections} connections</span>
                </div>
                <div className="d-inline-flex gap-1">
                  <a href="#" className="icon-button" title="Message" onClick={(event) => event.preventDefault()}>
                    <i className="ti ti-message-2" />
                  </a>
                  <a href="#" className="icon-button" title="Connect" onClick={(event) => event.preventDefault()}>
                    <i className="ti ti-user-plus" />
                  </a>
                  <a
                    href="#"
                    className="btn btn-primary btn-sm"
                    onClick={(event) => {
                      event.preventDefault();
                      onOpenProfile(member);
                    }}
                  >
                    Open Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="workspace-empty-state show mb-4">
        <div className="workspace-empty-art">
          <i className="ti ti-mood-empty" />
        </div>
        <h5>No alumni match your filters</h5>
        <p>Try adjusting your search terms or clearing the active filters to see more results.</p>
      </div>
    )}
  </>
);

export default MemberGrid;
