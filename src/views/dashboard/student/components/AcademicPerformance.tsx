import WidgetHeader from '../../shared/WidgetHeader';
import type { StudentModalId } from '../data/studentDashboard.data';
import {
  gpaFacts,
  gradeSpread,
  monthlyProgress,
  performanceSummary,
  progressHighlights,
  subjectPerformance,
  trendSparklinePaths,
} from '../data/studentDashboard.data';

export interface AcademicPerformanceProps {
  onOpenModal: (modal: StudentModalId) => void;
}

const AcademicPerformance = ({ onOpenModal }: AcademicPerformanceProps) => (
  <div className="card-widget card-widget-body mb-3">
    <WidgetHeader icon="ti ti-chart-histogram" title="Academic Performance">
      <div className="d-flex align-items-center gap-2">
        <span className="widget-subtitle">Term II · 2024-26</span>
        <button
          type="button"
          className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
          onClick={() => onOpenModal('results')}
        >
          <i className="ti ti-eye" />
          Full Report
        </button>
      </div>
    </WidgetHeader>

    <div className="performance-panel-rail align-items-start">
      {/* GPA rail */}
      <div className="score-rail d-flex flex-column align-items-center">
        <div className="progress-ring text-primary" style={{ '--v': 88 } as React.CSSProperties}>
          <div className="progress-ring-hole text-center">
            <b>8.8</b>
            <span>Overall GPA</span>
          </div>
        </div>
        <span className="badge badge-soft-success">
          <i className="ti ti-arrow-up me-1" />
          +0.3 vs Term I
        </span>

        <div className="fact-grid w-100">
          {gpaFacts.map((fact) => (
            <div className={`fact-tile ${fact.borderClass}`} key={fact.id}>
              <b>
                {fact.value}
                {fact.suffix ? <small>{fact.suffix}</small> : null}
              </b>
              <span>{fact.label}</span>
            </div>
          ))}
        </div>

        <div className="split-bar w-100">
          <div className="split-bar-head d-flex align-items-baseline justify-content-between">
            <span>Grade Spread</span>
            <b>5 subjects</b>
          </div>
          <div className="split-bar-track d-flex overflow-hidden">
            {gradeSpread.map((band) => (
              <span
                key={band.id}
                className={band.colorClass}
                style={{ width: band.width }}
                title={band.title}
              />
            ))}
          </div>
          <div className="split-bar-keys d-flex flex-wrap">
            {gradeSpread.map((band) => (
              <span key={band.id}>
                <i className={band.colorClass} />
                {band.label}
              </span>
            ))}
          </div>
        </div>

        <div className="term-list d-flex flex-column w-100">
          <div className="term-item border-info align-items-center">
            <span className="t">Term I</span>
            <span className="v">8.5</span>
            <span className="badge badge-soft-secondary">Base</span>
          </div>
        </div>
      </div>

      {/* Subject performance */}
      <div>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
          <h6 className="widget-subtitle mb-0">
            <i className="ti ti-list-numbers me-1" />
            Subject Performance
          </h6>
          <span className="subject-legend d-inline-flex align-items-center">
            <i className="mk" />
            Class average
          </span>
        </div>

        <div className="subject-list d-flex flex-column">
          {subjectPerformance.map((subject) => (
            <div
              className={`subject-item ${subject.borderClass} align-items-center`}
              key={subject.id}
            >
              <span className={`ic ${subject.iconClass}`}>
                <i className={subject.icon} />
              </span>
              <div className="mid">
                <div className="top">
                  <b>{subject.name}</b>
                  <span>{subject.teacher}</span>
                </div>
                <div className="progress progress-sm">
                  <div
                    className={`progress-bar ${subject.barClass}`}
                    style={{ width: `${subject.percent}%` }}
                  />
                  <i className="avg" style={{ left: subject.average }} />
                </div>
              </div>
              <div className="end">
                <span className="pc">
                  {subject.percent}
                  <small>%</small>
                </span>
                <span className={`gr ${subject.gradeClass}`}>{subject.grade}</span>
                <span className={`dl ${subject.deltaClass}`}>
                  <i className={subject.deltaIcon} />
                  {subject.delta}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="summary-grid">
          {performanceSummary.map((cell) => (
            <div className={`summary-cell ${cell.borderClass}`} key={cell.id}>
              <span className="k">{cell.key}</span>
              <b>{cell.value}</b>
            </div>
          ))}
        </div>

        <div className="insight-note bg-warning-transparent mt-3">
          <i className="ti ti-bulb text-warning" />
          <span>
            <b>English</b> is your only subject below the 75% target and the only one under the
            class average — 30 minutes of reading a day closes the gap.
          </span>
        </div>
      </div>

      {/* Trend */}
      <div className="trend-column">
        <h6 className="widget-subtitle mb-2">
          <i className="ti ti-trending-up me-1" />
          Monthly Progress
        </h6>

        <div className="trend-panel text-primary">
          <div className="trend-header d-flex align-items-start justify-content-between">
            <div>
              <b>
                88<small>%</small>
              </b>
              <span>December average</span>
            </div>
            <span className="badge badge-soft-success">
              <i className="ti ti-arrow-up me-1" />
              +14 since Aug
            </span>
          </div>
          <svg
            className="chart-sparkline d-block"
            viewBox="0 0 300 60"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path className="ar" d={trendSparklinePaths.area} />
            <path className="ln" d={trendSparklinePaths.line} />
          </svg>
        </div>

        <div className="bar-chart">
          {monthlyProgress.map((month) => (
            <div className={month.active ? 'b on' : 'b'} key={month.id}>
              <span className="val">{month.value}</span>
              <div className={`col ${month.barClass}`} style={{ height: `${month.value}%` }} />
              <span className="cap">{month.label}</span>
            </div>
          ))}
        </div>

        <div className="highlight-list d-flex flex-column">
          {progressHighlights.map((item) => (
            <div className={`highlight-item ${item.borderClass} d-flex align-items-center`} key={item.id}>
              <span className={`ic ${item.iconClass}`}>
                <i className={item.icon} />
              </span>
              <div className="tx">
                <b>{item.title}</b>
                <span>{item.detail}</span>
              </div>
              <span className={`badge ${item.badgeClass}`}>{item.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AcademicPerformance;
