import type { ParentActionId, ParentModalId } from '../data/parentDashboard.data';
import { financeSegments, paymentLines } from '../data/parentDashboard.data';
import PortalSection from './PortalSection';

export interface FeeTimelineProps {
  onOpenModal: (modal: ParentModalId) => void;
  onAction: (action: ParentActionId) => void;
}

const FeeTimeline = ({ onOpenModal, onAction }: FeeTimelineProps) => (
  <>
    <PortalSection icon="ti ti-wallet" eyebrow="Finance" title="Fee Timeline">
      <button
        type="button"
        className="portal-button portal-button-primary portal-button-xs d-inline-flex align-items-center text-nowrap text-decoration-none"
        onClick={() => onOpenModal('pay')}
      >
        <i className="ti ti-credit-card" />
        Pay Now
      </button>
    </PortalSection>

    <div className="card card-flush">
      <div className="card-body">
        <div className="finance-head d-flex align-items-center">
          <div>
            <div className="portal-sub">Paid this year</div>
            <div className="finance-figure">
              $6,500 <span className="fs-13 fw-semibold text-muted">/ $9,000</span>
            </div>
            <div className="finance-segment d-flex overflow-hidden">
              {financeSegments.map((segment) => (
                <span
                  key={segment.id}
                  style={{ background: segment.color, flex: segment.flex }}
                />
              ))}
            </div>
          </div>
          <div className="ms-auto text-end">
            <span className="badge badge-tag accent-success d-inline-flex align-items-center text-nowrap">
              <i className="ti ti-award" />
              Scholarship 15%
            </span>
            <br />
            <span className="badge badge-tag accent-info mt-1 d-inline-flex align-items-center text-nowrap">
              <i className="ti ti-discount" />
              Sibling 5%
            </span>
          </div>
        </div>

        <div className="payment-row position-relative">
          {paymentLines.map((line) => (
            <div className={`payment-line ${line.accent} align-items-center position-relative`} key={line.id}>
              <span className="avatar avatar-icon avatar-34 avatar-glyph-16 avatar-accent-soft">
                <i className={line.icon} />
              </span>
              <div className="payment-line-info">
                <b>{line.title}</b>
                <span>{line.detail}</span>
              </div>
              <div className="payment-line-amount">
                <b>{line.amount}</b>
                {line.badge ? (
                  <span className={`badge badge-tag ${line.badge.className} d-inline-flex align-items-center text-nowrap`}>
                    {line.badge.label}
                  </span>
                ) : null}
                {line.receipt ? (
                  <button
                    type="button"
                    className="portal-button portal-button-xs mt-1 d-inline-flex align-items-center text-nowrap text-decoration-none"
                    onClick={() => onAction('receipt')}
                  >
                    <i className="ti ti-download" />
                    Receipt
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default FeeTimeline;
