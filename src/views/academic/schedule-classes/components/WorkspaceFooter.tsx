import { weekOptions } from '../data/classSchedule.data';

export interface WorkspaceFooterProps {
  shown: number;
  total: number;
  week: string;
  onWeek: (week: string) => void;
  onStepWeek: (direction: -1 | 1) => void;
}

const WorkspaceFooter = ({ shown, total, week, onWeek, onStepWeek }: WorkspaceFooterProps) => (
  <div className="workspace-footer">
    <div className="workspace-footer-info">
      Showing <span className="range-from">{shown === 0 ? 0 : 1}</span>–<span className="range-to">{shown}</span> of{' '}
      <span className="range-total">{total}</span> classes this week
    </div>
    <div className="workspace-footer-size">
      <label className="mb-0">Week:</label>
      <select
        className="form-select"
        aria-label="Select week"
        value={week}
        onChange={(event) => onWeek(event.target.value)}
      >
        {weekOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
    <nav className="workspace-pagination" aria-label="Schedule weeks">
      <button
        type="button"
        className="workspace-page-button"
        aria-label="Previous week"
        onClick={() => onStepWeek(-1)}
      >
        <i className="ti ti-chevron-left" />
      </button>
      <button type="button" className="workspace-page-button active" aria-current="page">
        This week
      </button>
      <button
        type="button"
        className="workspace-page-button"
        aria-label="Next week"
        onClick={() => onStepWeek(1)}
      >
        <i className="ti ti-chevron-right" />
      </button>
    </nav>
  </div>
);

export default WorkspaceFooter;
