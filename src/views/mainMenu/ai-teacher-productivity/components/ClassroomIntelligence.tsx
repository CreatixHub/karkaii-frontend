import { classroomTiles } from '../data/productivity.data';

const ClassroomIntelligence = () => (
  <div className="row g-3 mb-5">
    {classroomTiles.map((tile) => (
      <div className="col-xl-3 col-md-6" key={tile.id}>
        <div className="tch-tile">
          <span className="tch-tile-ic">
            <i className={tile.icon} />
          </span>
          <p className="tch-tile-title">{tile.title}</p>
          <p className="fs-12 text-muted mb-0">{tile.body}</p>
        </div>
      </div>
    ))}
  </div>
);

export default ClassroomIntelligence;
