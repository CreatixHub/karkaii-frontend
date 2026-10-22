import { achievements } from '../../data/alumniProfile.data';

const AchievementsPane = () => (
  <div>
    <h5 className="mb-3">Achievements</h5>
    <ul className="list-unstyled">
      {achievements.map((item, index) => (
        <li className={`d-flex${index < achievements.length - 1 ? ' mb-3' : ' mb-0'}`} key={item.title}>
          <span className="avatar avatar-sm bg-soft-warning rounded-circle flex-shrink-0 me-2">
            <i className={item.icon} />
          </span>
          <div>
            <p className="mb-0 text-dark">{item.title}</p>
            <small className="text-muted">{item.year}</small>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default AchievementsPane;
