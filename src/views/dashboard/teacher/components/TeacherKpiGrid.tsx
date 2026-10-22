import type { TeacherModalId } from '../data/teacherDashboard.data';
import { kpiStats } from '../data/teacherDashboard.data';

export interface TeacherKpiGridProps {
  onOpenModal: (modal: TeacherModalId) => void;
}

const TeacherKpiGrid = ({ onOpenModal }: TeacherKpiGridProps) => (
  <div className="stats-grid mb-3">
    {kpiStats.map((stat) => (
      <button
        type="button"
        key={stat.id}
        className="card-stat position-relative overflow-hidden text-start"
        aria-label={stat.label}
        onClick={() => onOpenModal(stat.modal)}
      >
        <div className="card-stat-header d-flex align-items-center">
          <span className={`avatar avatar-icon ${stat.iconClass}`}>
            <i className={stat.icon} />
          </span>
          <span
            className={`card-stat-delta ${stat.deltaDirection} ms-auto d-inline-flex align-items-center`}
          >
            <i className={stat.deltaIcon} />
            {stat.delta}
          </span>
        </div>
        <div className="card-stat-value">
          {stat.value}
          {stat.valueSuffix ? <small>{stat.valueSuffix}</small> : null}
        </div>
        <div className="card-stat-label">{stat.label}</div>
      </button>
    ))}
  </div>
);

export default TeacherKpiGrid;
