import ImageWithBasePath from '@core/common/imageWithBasePath';
import {
  activeReaderAvatars,
  categoryBubbles,
  categoryRows,
} from '../data/adminDashboard.library';

const PopularCategoriesCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Categories</span>
      <h4 className="card-title mb-0">Popular Categories</h4>
    </div>
    <div className="card-body d-flex flex-column">
      <div className="bubble-cloud">
        {categoryBubbles.map((bubble) => (
          <div className={`bubble ${bubble.className}`} key={bubble.id}>
            <b>{bubble.percent}</b>
            <span>{bubble.label}</span>
          </div>
        ))}
      </div>

      <div className="data-list data-list-sm border-top pt-2 mt-2">
        {categoryRows.map((row) => (
          <div className="data-list-item" key={row.id}>
            <span className={`status-dot status-dot-lg status-dot-square ${row.dotClass}`} />
            <span className="data-list-body data-list-title">{row.label}</span>
            <span
              className={`badge ${row.trendClass} d-inline-flex align-items-center gap-1 rounded-pill`}
            >
              <i className={row.trendIcon} />
              {row.trend}
            </span>
            <span className="stat-label stat-label-sm">{row.books}</span>
          </div>
        ))}
      </div>

      <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-auto">
        <div>
          <span className="stat-caption d-block mb-2">Most Active Readers</span>
          <div className="avatar-list-stacked avatar-group-overlapped avatar-group-sm d-flex align-items-center">
            {activeReaderAvatars.map((avatar) => (
              <span className="avatar avatar-rounded" key={avatar}>
                <ImageWithBasePath src={avatar} alt="Reader" />
              </span>
            ))}
            <span className="stat-label ms-2">+128 readers</span>
          </div>
        </div>
        <div className="text-end">
          <div className="stat-value stat-value-sm">4,249</div>
          <span className="stat-label">Total borrowed</span>
        </div>
      </div>
    </div>
  </div>
);

export default PopularCategoriesCard;
