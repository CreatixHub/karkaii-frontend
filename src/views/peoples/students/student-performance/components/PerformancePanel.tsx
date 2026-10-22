import type { DetailStat, PerformanceModalId } from '../data/studentPerformance.data';
import type { PanelEntry } from '../data/performanceDialogs.data';
import {
  panelAudit,
  panelExamHistory,
  panelProgressStats,
  panelRecommendations,
  panelStudent,
  panelStudentStats,
  panelSummaryStats,
  panelTiles,
  panelTimeline,
} from '../data/performanceDialogs.data';

export interface PerformancePanelProps {
  onOpenModal: (modal: PerformanceModalId) => void;
}

const StatRows = ({ stats }: { stats: DetailStat[] }) => (
  <>
    {stats.map((stat, index) => (
      <div
        className={`d-flex align-items-center justify-content-between ${
          index === stats.length - 1 ? 'mb-0' : 'mb-2'
        }`}
        key={stat.label}
      >
        <span className="fs-13 text-muted">{stat.label}</span>
        {stat.badge ? (
          <span className={stat.badge}>
            {stat.badgeIcon ? <i className={`${stat.badgeIcon} me-1`} /> : null}
            {stat.value}
          </span>
        ) : (
          <span className="fs-13 fw-medium">{stat.value}</span>
        )}
      </div>
    ))}
  </>
);

const EntryList = ({ entries }: { entries: PanelEntry[] }) => (
  <>
    {entries.map((entry, index) => (
      <div
        className={`d-flex align-items-center gap-2 border rounded p-2 ${
          index === entries.length - 1 ? 'mb-3' : 'mb-2'
        }`}
        key={entry.id}
      >
        <span className={`avatar avatar-sm ${entry.tint} rounded flex-shrink-0`}>
          <i className={entry.icon} />
        </span>
        <div className="flex-fill overflow-hidden">
          <h6 className="fs-13 mb-0">{entry.title}</h6>
          <span className="fs-12 text-muted">{entry.meta}</span>
        </div>
      </div>
    ))}
  </>
);

const PerformancePanel = ({ onOpenModal }: PerformancePanelProps) => (
  <>
    <h6 className="fs-14 mb-2">Student Information</h6>
    <div className="d-flex align-items-center mb-3">
      <span className="avatar avatar-lg bg-primary-transparent text-primary rounded flex-shrink-0">
        <i className="ti ti-user fs-20" />
      </span>
      <div className="ms-2">
        <h6 className="mb-0">{panelStudent.name}</h6>
        <span className="fs-12 text-muted">{panelStudent.meta}</span>
      </div>
      <span className="badge badge-soft-success ms-auto">{panelStudent.level}</span>
    </div>
    <div className="border rounded p-3 mb-3">
      <StatRows stats={panelStudentStats} />
    </div>

    <h6 className="fs-14 mb-2">Academic Timeline</h6>
    <EntryList entries={panelTimeline} />

    <h6 className="fs-14 mb-2">Performance Summary</h6>
    <div className="row g-2 mb-3">
      {panelTiles.map((tile) => (
        <div className="col-4" key={tile.id}>
          <div className="border rounded p-2 text-center">
            <span className="fs-12 text-muted d-block mb-1">{tile.label}</span>
            <h6 className={tile.valueClass}>{tile.value}</h6>
          </div>
        </div>
      ))}
    </div>
    <div className="border rounded p-3 mb-3">
      <StatRows stats={panelSummaryStats} />
    </div>

    <h6 className="fs-14 mb-2">Exam History</h6>
    <div className="table-responsive border rounded mb-3">
      <table className="table table-nowrap mb-0">
        <thead className="table-light">
          <tr>
            <th className="fs-13">Exam</th>
            <th className="fs-13">Score</th>
            <th className="fs-13">Rank</th>
          </tr>
        </thead>
        <tbody>
          {panelExamHistory.map((entry) => (
            <tr key={entry.exam}>
              <td className="fs-13">{entry.exam}</td>
              <td className="fs-13">{entry.score}</td>
              <td className="fs-13">{entry.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h6 className="fs-14 mb-2">Learning Progress</h6>
    <div className="border rounded p-3 mb-3">
      <StatRows stats={panelProgressStats} />
    </div>

    <h6 className="fs-14 mb-2">Recommendations</h6>
    <EntryList entries={panelRecommendations} />

    <h6 className="fs-14 mb-2">Audit History</h6>
    <EntryList entries={panelAudit} />

    <div className="d-flex gap-2">
      <button
        type="button"
        className="btn btn-primary flex-fill"
        onClick={() => onOpenModal('share')}
      >
        <i className="ti ti-share me-1" />
        Share Report
      </button>
      <button
        type="button"
        className="btn btn-outline-light bg-white"
        onClick={() => onOpenModal('compare')}
      >
        <i className="ti ti-git-compare me-1" />
        Compare
      </button>
    </div>
  </>
);

export default PerformancePanel;
