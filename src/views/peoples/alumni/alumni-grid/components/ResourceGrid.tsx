import { resources } from '../data/alumni.data';

export interface ResourceGridProps {
  onOpen: (id: string) => void;
}

const ResourceGrid = ({ onOpen }: ResourceGridProps) => (
  <>
    <div className="section-header">
      <div>
        <h5 className="section-title">Community Resources</h5>
        <p className="section-subtitle">Archives and references maintained for the alumni community</p>
      </div>
      <span className="section-rule" />
    </div>

    <div className="row g-3 mb-4">
      {resources.map((resource) => (
        <div className="col-xxl-3 col-lg-4 col-md-6 d-flex" key={resource.id}>
          <a
            href="#"
            className="resource"
            onClick={(event) => {
              event.preventDefault();
              onOpen(resource.id);
            }}
          >
            <span className="resource-icon">
              <i className={resource.icon} />
            </span>
            <div className="resource-main">
              <h6>{resource.title}</h6>
              <p>{resource.subtitle}</p>
            </div>
            <i className="ti ti-arrow-right resource-go" />
          </a>
        </div>
      ))}
    </div>
  </>
);

export default ResourceGrid;
