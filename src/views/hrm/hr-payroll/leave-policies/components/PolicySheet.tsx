import type { InfoTile, LeavePolicy, RuleLine, Segment } from '../data/leavePolicies.data';
import { approvalSteps, requiredDocuments, statusBadge } from '../data/leavePolicies.data';

const renderSegments = (segments: Segment[]) =>
  segments.map((segment, index) =>
    typeof segment === 'string' ? (
      // eslint-disable-next-line react/no-array-index-key
      <span key={index}>{segment}</span>
    ) : (
      // eslint-disable-next-line react/no-array-index-key
      <span className="fw-medium" key={index}>
        {segment.b}
      </span>
    ),
  );

const TileRow = ({ tiles }: { tiles: InfoTile[] }) => (
  <div className="row g-3 mb-2">
    {tiles.map((tile) => (
      <div className="col-12 col-xl-3 col-md-6" key={tile.label}>
        <div className="border rounded p-3 h-100">
          <p className="fs-12 text-muted mb-1">{tile.label}</p>
          {tile.badges ? (
            <div className="d-flex flex-wrap gap-1">
              {tile.badges.map((badge) => (
                <span className={`badge badge-soft-${badge.tone} fs-10`} key={badge.label}>
                  {badge.label}
                </span>
              ))}
            </div>
          ) : (
            <h6 className="fs-14 mb-0">{tile.value}</h6>
          )}
        </div>
      </div>
    ))}
  </div>
);

const RuleBox = ({ lines }: { lines: RuleLine[] }) => (
  <div className="border rounded p-3">
    {lines.map((line, index) => (
      <div
        className={`d-flex align-items-start${index === lines.length - 1 ? '' : ' mb-3'}`}
        // eslint-disable-next-line react/no-array-index-key
        key={index}
      >
        <i className={`${line.icon} ${line.tone} me-2 mt-1`} />
        <span className="fs-13">{renderSegments(line.segments)}</span>
      </div>
    ))}
  </div>
);

const SectionHeading = ({ icon, tint, title, tag }: { icon: string; tint: string; title: string; tag?: 'h5' | 'h6' }) => {
  const Heading = tag ?? 'h6';
  return (
    <div className="d-flex align-items-center mb-3">
      <span className={`avatar avatar-sm bg-${tint}-transparent text-${tint} rounded me-2`}>
        <i className={icon} />
      </span>
      <Heading className={tag === 'h5' ? 'mb-0 fs-15' : 'mb-0'}>{title}</Heading>
    </div>
  );
};

export interface PolicySheetProps {
  policy: LeavePolicy;
  onPrint: () => void;
  onEdit: () => void;
}

const PolicySheet = ({ policy, onPrint, onEdit }: PolicySheetProps) => (
  <div className="card">
    <div className="card-header d-lg-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center mb-3 mb-lg-0">
        <span className={`avatar avatar-lg bg-${policy.tint}-transparent text-${policy.tint} rounded me-3`}>
          <i className={`${policy.icon} fs-20`} />
        </span>
        <div>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
            <h4 className="mb-0 fs-16 fw-medium">{policy.name}</h4>
            <span className="badge badge-soft-bordered">{policy.code}</span>
            <span className={`${statusBadge[policy.status]} d-inline-flex align-items-center`}>
              <i className="ti ti-circle-filled fs-5 me-1" />
              {policy.status}
            </span>
          </div>
          <p className="mb-0 fs-13 text-muted">
            {policy.audience} &nbsp;•&nbsp; Effective {policy.effectiveFrom} &nbsp;•&nbsp; Revision {policy.revision}
          </p>
        </div>
      </div>
      <div className="d-flex align-items-center flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
          onClick={onPrint}
        >
          <i className="ti ti-printer me-1" />
          Print Policy
        </button>
        <button type="button" className="btn btn-primary btn-sm d-inline-flex align-items-center" onClick={onEdit}>
          <i className="ti ti-edit me-1" />
          Edit Policy
        </button>
      </div>
    </div>
    <div className="card-body">
      {/* Eligibility */}
      <SectionHeading icon="ti ti-user-check" tint="primary" title="Eligibility" tag="h5" />
      <TileRow tiles={policy.eligibility} />

      <hr className="my-4" />

      {/* Leave Entitlement */}
      <SectionHeading icon="ti ti-calendar-check" tint="success" title="Leave Entitlement" />
      <TileRow tiles={policy.entitlement} />

      <hr className="my-4" />

      {/* Carry Forward & Encashment */}
      <div className="row g-4 mb-2">
        <div className="col-12 col-lg-6">
          <SectionHeading icon="ti ti-arrow-forward-up" tint="info" title="Carry Forward Rules" />
          <RuleBox lines={policy.carryForward} />
        </div>
        <div className="col-12 col-lg-6">
          <SectionHeading icon="ti ti-cash" tint="warning" title="Encashment Rules" />
          <RuleBox lines={policy.encashment} />
        </div>
      </div>

      <hr className="my-4" />

      {/* Approval Process */}
      <SectionHeading icon="ti ti-checkup-list" tint="purple" title="Approval Process" />
      <div className="row g-3 mb-2">
        {approvalSteps.map((step) => (
          <div className="col-12 col-xl-3 col-md-6" key={step.badge}>
            <div className="border rounded p-3 h-100">
              <span className={`badge badge-soft-${step.tone} fs-10 mb-2`}>{step.badge}</span>
              <h6 className="fs-14 mb-1">{step.title}</h6>
              <p className="fs-12 text-muted mb-0">{step.note}</p>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-4" />

      {/* Required Documents */}
      <SectionHeading icon="ti ti-file-text" tint="skyblue" title="Required Documents" />
      <div className="d-flex flex-wrap gap-2">
        {requiredDocuments.map((doc) => (
          <span className={`badge badge-soft-${doc.tone} d-inline-flex align-items-center`} key={doc.label}>
            <i className={`${doc.icon} me-1`} />
            {doc.label}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default PolicySheet;
