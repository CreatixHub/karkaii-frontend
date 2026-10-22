import type { BarItem, DistributionItem } from '../data/studentPromotion.data';

export interface PromotionAnalyticsProps {
  donutPromotionPct: number;
  donutDetainedPct: number;
  classWiseBars: BarItem[];
  genderDistribution: DistributionItem[];
  performanceDistribution: DistributionItem[];
  revealed: boolean;
}

const PromotionAnalytics = ({
  donutPromotionPct,
  donutDetainedPct,
  classWiseBars,
  genderDistribution,
  performanceDistribution,
  revealed,
}: PromotionAnalyticsProps) => (
  <div className="panel-block panel-block-body mb-3">
    <h6 className="heading-row">
      <i className="ti ti-chart-histogram" />
      Promotion Analytics
    </h6>
    <div className="analysis-grid">
      <div className="analysis-block">
        <h6>
          <i className="ti ti-chart-donut" />
          Promotion vs Detention
        </h6>
        <div className="donut-graph">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="47" stroke="var(--pw-soft)" />
            <circle
              cx="60"
              cy="60"
              r="47"
              stroke="#16a34a"
              strokeDasharray="272 295"
              strokeLinecap="round"
              className="donut-segment"
            />
          </svg>
          <div className="c">
            <b>{revealed ? donutPromotionPct : 0}%</b>
            <span>Promotion</span>
          </div>
        </div>
        <div className="legend-row">
          <div>
            <span className="k" style={{ background: '#16a34a' }} />
            Promoted<b>{donutPromotionPct}%</b>
          </div>
          <div>
            <span className="k" style={{ background: '#e7eaf1' }} />
            Detained<b>{donutDetainedPct}%</b>
          </div>
        </div>
      </div>
      <div className="analysis-block">
        <h6>
          <i className="ti ti-chart-bar" />
          Class-wise Comparison
        </h6>
        <div className="bar-list">
          {classWiseBars.map((bar) => (
            <div className={`b${bar.alt ? ' alt' : ''}`} key={bar.label}>
              <span className="val">{bar.value}%</span>
              <div className="col" style={{ height: revealed ? `${bar.value}%` : 0 }} />
              <span className="cap">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="analysis-block">
        <h6>
          <i className="ti ti-users" />
          Gender-wise Promotion
        </h6>
        <div className="distribution">
          {genderDistribution.map((item) => (
            <div className="distribution-row" key={item.label}>
              <div className="top">
                <span>{item.label}</span>
                <b>{item.value}%</b>
              </div>
              <div className="tr">
                <span style={{ width: revealed ? `${item.value}%` : 0, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
        <h6 className="mt-4">
          <i className="ti ti-award" />
          Performance Distribution
        </h6>
        <div className="distribution">
          {performanceDistribution.map((item) => (
            <div className="distribution-row" key={item.label}>
              <div className="top">
                <span>{item.label}</span>
                <b>{item.value}%</b>
              </div>
              <div className="tr">
                <span style={{ width: revealed ? `${item.value}%` : 0, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default PromotionAnalytics;
