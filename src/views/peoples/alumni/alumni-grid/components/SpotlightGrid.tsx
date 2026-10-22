import ImageWithBasePath from '@core/common/imageWithBasePath';
import { spotlights } from '../data/alumni.data';

export interface SpotlightGridProps {
  onShareStory: () => void;
  onReadStory: (id: string) => void;
}

const SpotlightGrid = ({ onShareStory, onReadStory }: SpotlightGridProps) => (
  <>
    <div className="section-header">
      <div>
        <h5 className="section-title">Alumni Spotlight</h5>
        <p className="section-subtitle">Stories the school is telling this term</p>
      </div>
      <span className="section-rule" />
      <button
        type="button"
        className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center flex-shrink-0"
        onClick={onShareStory}
      >
        <i className="ti ti-sparkles me-1" />
        Share a Story
      </button>
    </div>

    <div className="row g-3 mb-4">
      {spotlights.map((story) => (
        <div className="col-12 col-xxl-4 col-lg-6 d-flex" key={story.id}>
          <div className="spotlight">
            <div className="spotlight-photo">
              <ImageWithBasePath src={story.photo} alt={story.alt} />
              <span className="status-badge is-featured spotlight-ribbon">
                <i className="ti ti-star-filled" />
                Featured
              </span>
              <span className="spotlight-award">
                <i className={story.awardIcon} />
                {story.awardLabel}
              </span>
            </div>
            <div className="spotlight-body">
              <h6>{story.headline}</h6>
              <p>{story.body}</p>
            </div>
            <div className="spotlight-footer">
              <div className="spotlight-who">
                <ImageWithBasePath src={story.personAvatar} alt="" />
                <div>
                  <b>{story.personName}</b>
                  <small>{story.personMeta}</small>
                </div>
              </div>
              <a
                href="#"
                className="icon-button"
                aria-label="Read story"
                onClick={(event) => {
                  event.preventDefault();
                  onReadStory(story.id);
                }}
              >
                <i className="ti ti-arrow-right" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default SpotlightGrid;
