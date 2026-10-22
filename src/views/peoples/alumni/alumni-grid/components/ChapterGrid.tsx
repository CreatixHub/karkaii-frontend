import ImageWithBasePath from '@core/common/imageWithBasePath';
import { chapterCards } from '../data/alumni.data';

export interface ChapterGridProps {
  onNewChapter: () => void;
}

const ChapterGrid = ({ onNewChapter }: ChapterGridProps) => (
  <>
    <div className="section-header">
      <div>
        <h5 className="section-title">Alumni Chapters</h5>
        <p className="section-subtitle">Regional and interest groups run by alumni volunteers</p>
      </div>
      <span className="section-rule" />
      <button
        type="button"
        className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center flex-shrink-0"
        onClick={onNewChapter}
      >
        <i className="ti ti-plus me-1" />
        New Chapter
      </button>
    </div>

    <div className="row g-3 mb-4">
      {chapterCards.map((chapter) => (
        <div className="col-12 col-xxl-4 col-lg-6 d-flex" key={chapter.id}>
          <div className={`chapter ${chapter.hue}`}>
            <div className="chapter-header">
              <span className="crest">
                <i className={chapter.crestIcon} />
              </span>
              <div>
                <h6>{chapter.name}</h6>
                <p>{chapter.location}</p>
              </div>
              <span className={`status-badge ${chapter.statusClass} ms-auto`}>
                <i className="ti ti-circle-filled" />
                {chapter.statusLabel}
              </span>
            </div>
            <div className="meetup">
              <i className="ti ti-calendar-event" />
              <div className="meetup-text">
                {chapter.meetupTitle}
                <small>{chapter.meetupWhen}</small>
              </div>
            </div>
            <p className="fs-12 text-muted mb-0">{chapter.latest}</p>
            <div className="chapter-footer">
              <div className="coordinator">
                <ImageWithBasePath src={chapter.coordinatorAvatar} alt="" />
                <div>
                  <span>{chapter.coordinatorName}</span>
                  <small>Coordinator</small>
                </div>
              </div>
              <div className="text-end">
                <span className="d-block fw-semibold fs-14">{chapter.members}</span>
                <small className="text-muted fs-11">Members</small>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default ChapterGrid;
