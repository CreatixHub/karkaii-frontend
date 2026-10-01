import type { StatCard, StatId } from '../data/subjectPerformance.data';
import { statCards } from '../data/subjectPerformance.data';

export interface PerformanceStatsProps {
  counts: Record<StatId, number>;
}

const PerformanceStats = ({ counts }: PerformanceStatsProps) => (
  <div className="row">
    {statCards.map((card: StatCard) => (
      <div className="col-xl-3 col-sm-6 d-flex" key={card.id}>
        <div className="card flex-fill">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <p className="mb-1">{card.label}</p>
              {/* The template printed "1,248", so the grouping separator is kept. */}
              <h4 className="mb-0">{counts[card.id].toLocaleString()}</h4>
            </div>
            <span className={`avatar avatar-lg ${card.tone} rounded`}>
              <i className={`${card.icon} fs-24`} />
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default PerformanceStats;
