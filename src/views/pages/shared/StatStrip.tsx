export interface Stat {
  id: string;
  label: string;
  value: string;
  icon: string;
  /** Bootstrap tint stem: "danger" expands to `.stat-danger` and the icon tint. */
  tint: string;
  /** The small badge some tiles carry, e.g. "Month" or "Good". */
  badge?: { label: string; tint: string };
}

export interface StatStripProps {
  stats: Stat[];
}

/** Six tiles to a row, four to a row, three to a row — whatever fits evenly. */
const spanFor = (count: number) => {
  if (count >= 6) return 'col-xxl-2 col-lg-4 col-sm-6';
  if (count === 5) return 'col-xxl-2 col-lg-4 col-sm-6';
  if (count === 4) return 'col-xxl-3 col-lg-3 col-sm-6';
  return 'col-xxl-4 col-lg-4 col-sm-6';
};

const StatStrip = ({ stats }: StatStripProps) => {
  const span = spanFor(stats.length);

  return (
    <div className="row g-3 mb-1">
      {stats.map((stat) => (
        <div className={`${span} d-flex`} key={stat.id}>
          <div className={`card stat-card stat-${stat.tint} w-100`}>
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <span className={`stat-icon bg-${stat.tint}-transparent text-${stat.tint}`}>
                  <i className={stat.icon} />
                </span>
                {stat.badge ? (
                  <span className={`badge badge-soft-${stat.badge.tint} fs-11`}>
                    {stat.badge.label}
                  </span>
                ) : null}
              </div>
              <h3 className="stat-value mt-3 mb-0">{stat.value}</h3>
              <p className="mb-0 text-muted fs-13">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatStrip;
