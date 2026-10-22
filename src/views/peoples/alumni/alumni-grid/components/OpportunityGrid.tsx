import ImageWithBasePath from '@core/common/imageWithBasePath';
import { opportunities } from '../data/alumni.data';

export interface OpportunityGridProps {
  onPostOpportunity: () => void;
}

const OpportunityGrid = ({ onPostOpportunity }: OpportunityGridProps) => (
  <>
    <div className="section-header">
      <div>
        <h5 className="section-title">Alumni Opportunities</h5>
        <p className="section-subtitle">Openings posted by alumni for students and fellow alumni</p>
      </div>
      <span className="section-rule" />
      <button
        type="button"
        className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center flex-shrink-0"
        onClick={onPostOpportunity}
      >
        <i className="ti ti-plus me-1" />
        Post Opportunity
      </button>
    </div>

    <div className="row g-3 mb-4">
      {opportunities.map((post) => (
        <div className="col-12 col-xxl-3 col-lg-6 d-flex" key={post.id}>
          <div className="post">
            <span className="post-category" />
            <div className="post-header">
              <div>
                <h6>{post.title}</h6>
                <span className="post-org">
                  <ImageWithBasePath src={post.orgAvatar} alt="" />
                  {post.orgName}
                </span>
              </div>
              <span className="status-badge is-accent">{post.categoryLabel}</span>
            </div>
            <div className="post-meta">
              <span>
                <i className={post.metaLocationIcon} />
                {post.metaLocation}
              </span>
              <span>
                <i className={post.metaSecondIcon} />
                {post.metaSecond}
              </span>
            </div>
            <div className="deadline">
              <span className="deadline-when">
                <i className="ti ti-calendar-due" />
                {post.deadlineText}
              </span>
              <span className={`status-badge ${post.statusClass}`}>{post.statusLabel}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default OpportunityGrid;
