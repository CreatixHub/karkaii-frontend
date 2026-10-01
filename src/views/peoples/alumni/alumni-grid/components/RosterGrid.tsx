import ImageWithBasePath from '@core/common/imageWithBasePath';
import { rosterGroups } from '../data/alumni.data';

export interface RosterGridProps {
  onRequestMentor: () => void;
}

const RosterGrid = ({ onRequestMentor }: RosterGridProps) => (
  <>
    <div className="section-header">
      <div>
        <h5 className="section-title">Career &amp; Mentorship</h5>
        <p className="section-subtitle">Alumni who give time back to students, grouped by how they help</p>
      </div>
      <span className="section-rule" />
      <button
        type="button"
        className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center flex-shrink-0"
        onClick={onRequestMentor}
      >
        <i className="ti ti-compass me-1" />
        Request Mentor
      </button>
    </div>

    <div className="row g-3 mb-4">
      {rosterGroups.map((group) => (
        <div className="col-12 col-xxl-3 col-lg-6 d-flex" key={group.id}>
          <div className="roster">
            <div className="roster-header">
              <span className="roster-icon">
                <i className={group.icon} />
              </span>
              <div>
                <h6>{group.title}</h6>
                <p>{group.subtitle}</p>
              </div>
            </div>
            {group.people.map((person) => (
              <div className="person" key={`${group.id}-${person.name}`}>
                <ImageWithBasePath src={person.avatar} alt="" />
                <div className="person-main">
                  <p className="person-name">{person.name}</p>
                  <p className="person-org">{person.org}</p>
                  <span className={`availability ${person.availabilityClass}`}>{person.availabilityLabel}</span>
                </div>
                <div className="person-meta">
                  <span className="years">{person.metaValue}</span>
                  <small>{person.metaUnit}</small>
                </div>
              </div>
            ))}
            <div className="roster-footer">
              {group.footerOpensMentor ? (
                <button type="button" className="btn btn-light btn-sm w-100 fw-medium" onClick={onRequestMentor}>
                  {group.footerLabel}
                </button>
              ) : (
                <a href="#" className="btn btn-light btn-sm w-100 fw-medium" onClick={(event) => event.preventDefault()}>
                  {group.footerLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default RosterGrid;
