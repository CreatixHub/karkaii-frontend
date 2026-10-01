export interface SummaryStripItem {
  id: string;
  /** Accent name, e.g. "teal" — see the `accent-*` map in `_avatar.scss`. */
  accent: string;
  icon: string;
  value: string;
  label: string;
}

export interface SummaryStripProps {
  items: SummaryStripItem[];
}

const SummaryStrip = ({ items }: SummaryStripProps) => (
  <div className="summary-strip">
    {items.map((item) => (
      <div className={`summary-card accent-${item.accent}`} key={item.id}>
        <span className="summary-card-icon">
          <i className={item.icon} />
        </span>
        <div className="summary-card-value">{item.value}</div>
        <p className="summary-card-label">{item.label}</p>
      </div>
    ))}
  </div>
);

export default SummaryStrip;
