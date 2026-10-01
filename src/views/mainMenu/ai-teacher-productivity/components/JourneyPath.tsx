import { journeyLegs } from '../data/productivity.data';

export interface JourneyPathProps {
  /** `fs-13` on the page, `fs-12` inside the offcanvas. */
  bodyClass?: string;
}

const JourneyPath = ({ bodyClass = 'fs-13' }: JourneyPathProps) => (
  <div className="tch-path">
    {journeyLegs.map((leg) => (
      <div className={`tch-leg ${leg.state}`} key={leg.n}>
        <span className="tch-leg-n">{leg.n}</span>
        <div>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <p className="tch-leg-title">{leg.title}</p>
            <span className="tch-pill">{leg.date}</span>
          </div>
          <p className={`${bodyClass} text-muted mb-0`}>{leg.body}</p>
        </div>
      </div>
    ))}
  </div>
);

export default JourneyPath;
