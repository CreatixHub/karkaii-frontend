import type { LeavePolicy } from '../data/leavePolicies.data';
import { statusBadge } from '../data/leavePolicies.data';

export interface PolicyCardProps {
  policy: LeavePolicy;
  selected: boolean;
  onSelect: () => void;
}

const PolicyCard = ({ policy, selected, onSelect }: PolicyCardProps) => (
  <div className="col-12 col-xxl-3 col-md-6 d-flex">
    <button
      type="button"
      className={`card flex-fill w-100 text-start border-0 p-0${selected ? ' card-selected' : ''}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className={`avatar avatar-lg bg-${policy.tint}-transparent text-${policy.tint} rounded`}>
            <i className={`${policy.icon} fs-20`} />
          </span>
          {selected ? (
            <span className="badge badge-soft-primary d-inline-flex align-items-center">
              <i className="ti ti-circle-check me-1" />
              Selected
            </span>
          ) : (
            <span className={`${statusBadge[policy.status]} d-inline-flex align-items-center`}>
              <i className="ti ti-circle-filled fs-5 me-1" />
              {policy.status}
            </span>
          )}
        </div>
        <h4 className="fs-14 mb-1 fw-medium">{policy.name}</h4>
        <p className="fs-12 text-muted mb-3">
          {policy.code} &nbsp;•&nbsp; {policy.type}
        </p>
        <div className="d-flex align-items-baseline gap-1 mb-3">
          <h3 className="mb-0">{policy.allowance}</h3>
          {policy.allowanceUnit ? <span className="fs-12 text-muted">{policy.allowanceUnit}</span> : null}
        </div>
        <div className="d-flex flex-wrap gap-1">
          {policy.badges.map((badge) => (
            <span className={`badge badge-soft-${badge.tone} fs-10`} key={badge.label}>
              <i className={`${badge.icon} me-1`} />
              {badge.label}
            </span>
          ))}
        </div>
      </div>
    </button>
  </div>
);

export default PolicyCard;
