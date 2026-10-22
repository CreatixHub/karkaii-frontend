import type { TeacherModalId } from '../data/teacherDashboard.data';
import {
  performanceMetrics,
  performanceTrendPaths,
} from '../data/teacherDashboard.data';
import WidgetHeader from '../../shared/WidgetHeader';

export interface ClassPerformanceProps {
  onOpenModal: (modal: TeacherModalId) => void;
}

const ClassPerformance = ({ onOpenModal }: ClassPerformanceProps) => (
  <div className="card-widget card-widget-body mb-3">
    <WidgetHeader icon="ti ti-chart-histogram" title="Class Performance">
      <button
        type="button"
        className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
        onClick={() => onOpenModal('performance')}
      >
        <i className="ti ti-eye" />
        View Details
      </button>
    </WidgetHeader>

    <div className="performance-panel">
      {performanceMetrics.map((metric) => (
        <div className="card p-3 mb-0" key={metric.id}>
          <div className="d-flex align-items-center justify-content-between">
            <span className={`avatar avatar-icon avatar-sm ${metric.iconClass}`}>
              <i className={metric.icon} />
            </span>
            <span className="badge badge-soft-success">
              {metric.badgeIcon ? <i className={metric.badgeIcon} /> : null}
              {metric.badge}
            </span>
          </div>
          <div className="fs-22 fw-bold text-dark mt-2 mb-1">{metric.value}</div>
          <div className="fs-11 text-muted">{metric.label}</div>
          <div
            className="progress"
            role="progressbar"
            aria-label={metric.label}
            aria-valuenow={metric.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ '--bs-progress-height': '6px' } as React.CSSProperties}
          >
            <div className="progress-bar" style={{ width: `${metric.percent}%` }} />
          </div>
        </div>
      ))}

      <div className="card p-3 mb-0">
        <div className="d-flex align-items-center justify-content-between">
          <span className="avatar avatar-icon avatar-sm bg-warning-transparent">
            <i className="ti ti-trending-up" />
          </span>
          <span className="badge badge-soft-success">
            <i className="ti ti-arrow-up" />
            Rising
          </span>
        </div>
        <svg
          className="chart-sparkline d-block w-100"
          viewBox="0 0 120 34"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path className="ar" d={performanceTrendPaths.area} />
          <path className="ln" d={performanceTrendPaths.line} />
        </svg>
        <div className="fs-11 text-muted">Performance Trend (6 wks)</div>
      </div>
    </div>
  </div>
);

export default ClassPerformance;
