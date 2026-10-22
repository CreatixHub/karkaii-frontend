import {
  lateArrivalBars,
  leaveAnalysisRows,
  leaveAnalysisStats,
  timelineRows,
  weeklyTrendAxis,
} from '../data/attendanceAnalytics.data';
import AttendanceHeatmap from './AttendanceHeatmap';

export interface AttendanceAnalyticsPanelProps {
  range: 'week' | 'month' | 'term';
  onRange: (range: 'week' | 'month' | 'term') => void;
}

const AttendanceAnalyticsPanel = ({ range, onRange }: AttendanceAnalyticsPanelProps) => (
  <>
    <div className="section-bar">
      <div>
        <span className="eyebrow-text">
          <i className="ti ti-chart-histogram" />
          Analytics
        </span>
        <h3 className="section-bar-title">Attendance Performance</h3>
      </div>
      <div className="segmented-control" role="group" aria-label="Range">
        {(['week', 'month', 'term'] as const).map((item) => (
          <button
            key={item}
            type="button"
            className={range === item ? 'is-on' : undefined}
            onClick={() => onRange(item)}
          >
            {item === 'week' ? 'Week' : item === 'month' ? 'Month' : 'Term'}
          </button>
        ))}
      </div>
    </div>

    <div className="row g-3 mb-3">
      <div className="col-lg-12">
        <div className="side-panel h-100">
          <div className="side-panel-head">
            <b>
              <i className="ti ti-wave-sine" />
              Weekly Trend
            </b>
            <div className="attendance-legend">
              <span className="is-present">
                <i />
                Present
              </span>
              <span className="is-late">
                <i />
                Late
              </span>
              <span className="is-absent">
                <i />
                Absent
              </span>
            </div>
          </div>
          <svg
            className="chart-area"
            viewBox="0 0 640 190"
            preserveAspectRatio="none"
            role="img"
            aria-label="Attendance percentage from Monday to Friday"
          >
            <defs>
              <linearGradient id="attFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--att-present)" stopOpacity=".24" />
                <stop offset="100%" stopColor="var(--att-present)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g className="chart-area-grid">
              <path d="M0,38 H640 M0,76 H640 M0,114 H640 M0,152 H640" />
            </g>
            <path className="chart-area-fill" d="M0,74 L160,60 L320,86 L480,52 L640,40 L640,190 L0,190 Z" />
            <path className="chart-area-line" d="M0,74 L160,60 L320,86 L480,52 L640,40" />
            <g className="chart-area-dots">
              <circle cx="0" cy="74" r="4" />
              <circle cx="160" cy="60" r="4" />
              <circle cx="320" cy="86" r="4" />
              <circle cx="480" cy="52" r="4" />
              <circle cx="640" cy="40" r="5" className="is-last" />
            </g>
          </svg>
          <div className="chart-axis">
            {weeklyTrendAxis.map((point) => (
              <span key={point.day}>
                {point.day}
                <b>{point.pct}</b>
              </span>
            ))}
          </div>

          <h4 className="detail-drawer-heading mt-3 fs-15 fw-medium">
            <i className="ti ti-layout-grid" />
            Monthly Pattern · last 30 school days
          </h4>
          <AttendanceHeatmap
            heatKey="school"
            large
            ariaLabel="School-wide attendance heatmap for the last 30 school days"
          />
          <div className="attendance-heatmap-legend">
            <span>Below 85%</span>
            <i className="l1" />
            <i className="l2" />
            <i className="l3" />
            <i className="l4" />
            <span>Above 97%</span>
            <i className="is-absent ms-2" />
            <span>Holiday</span>
          </div>
        </div>
      </div>
    </div>

    <div className="row g-3 mb-3">
      <div className="col-12 col-xl-4">
        <div className="side-panel h-100">
          <div className="side-panel-head">
            <b>
              <i className="ti ti-clock-exclamation" />
              Late Arrival Analysis
            </b>
          </div>
          <div className="bar-chart" aria-label="Late arrivals by time band" role="img">
            {lateArrivalBars.map((bar) => (
              <div className={`b${bar.peak ? ' is-peak' : ''}`} key={bar.label}>
                <span className="v">{bar.count}</span>
                <div className="col is-late" style={{ height: `${bar.height}%` }} />
                <span className="c">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-12 col-xl-4">
        <div className="side-panel h-100">
          <div className="side-panel-head">
            <b>
              <i className="ti ti-calendar-off" />
              Leave Analysis
            </b>
            <span className="sub-text">This term</span>
          </div>
          <div className="attendance-compare">
            {leaveAnalysisRows.map((row) => (
              <div className={`attendance-compare-row is-${row.variant}`} key={row.label}>
                <span className="n">{row.label}</span>
                <span className="tr">
                  <span style={{ width: `${row.pct}%` }} />
                </span>
                <b>{row.pct}%</b>
              </div>
            ))}
          </div>
          <div className="row g-2 mt-3">
            {leaveAnalysisStats.map((stat) => (
              <div className="col-4" key={stat.label}>
                <div className={`stat-fact is-${stat.variant}`}>
                  <b>{stat.count}</b>
                  <span>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-12 col-xl-4">
        <div className="side-panel h-100">
          <div className="side-panel-head">
            <b>
              <i className="ti ti-timeline" />
              Today&apos;s Timeline
            </b>
            <span className="status-chip is-live">Live</span>
          </div>
          <div className="timeline-rows">
            {timelineRows.map((row) => (
              <div className={`timeline-row-item is-${row.variant}`} key={row.title}>
                <span className="tm">{row.time}</span>
                <span className="pt" aria-hidden="true" />
                <div className="bd">
                  <b>{row.title}</b>
                  <p>{row.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);

export default AttendanceAnalyticsPanel;
