import { routineBreaks } from '../../data/teacherRoutine.data';

const RoutineBreakCards = () => (
  <div className="card-footer border-0 pb-0">
    <div className="row">
      {routineBreaks.map((item) => (
        <div className={item.colClassName} key={item.id}>
          <div className="card flex-fill rounded overflow-hidden">
            <div className={`card-body ${item.bodyClassName}`}>
              <span className={`${item.badgeClassName} badge badge-sm mb-2`}>{item.label}</span>
              <p className="text-dark">
                <i className="ti ti-clock me-1" />
                {item.time}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RoutineBreakCards;
