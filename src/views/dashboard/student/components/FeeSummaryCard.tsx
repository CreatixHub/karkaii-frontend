import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';
import type { StudentModalId } from '../data/studentDashboard.data';
import {
  feeDiscounts,
  feeDonutSegments,
  feeLegend,
  paymentHistory,
} from '../data/studentDashboard.data';

const routes = all_routes;

export interface FeeSummaryCardProps {
  onOpenModal: (modal: StudentModalId) => void;
}

const FeeSummaryCard = ({ onOpenModal }: FeeSummaryCardProps) => (
  <div className="card-widget card-widget-body h-100">
    <WidgetHeader icon="ti ti-report-money" title="Fee Summary">
      <button
        type="button"
        className="action-button action-button-sm action-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"
        onClick={() => onOpenModal('pay')}
      >
        <i className="ti ti-credit-card" />
        Pay Now
      </button>
    </WidgetHeader>

    <div className="row g-3">
      <div className="col-md-5">
        <div
          className="donut-chart position-relative"
          role="img"
          aria-label="Fee breakdown: 72% paid, 22% pending, 6% overdue"
        >
          <svg viewBox="0 0 140 140" aria-hidden="true">
            <circle className="track" cx="70" cy="70" r="54" />
            {feeDonutSegments.map((segment) => (
              <circle
                key={segment.id}
                className={`seg ${segment.className}`}
                cx="70"
                cy="70"
                r="54"
                strokeDasharray={segment.dashArray}
                strokeDashoffset={segment.dashOffset}
              />
            ))}
          </svg>
          <div className="c">
            <b>72%</b>
            <span>Paid</span>
            <em>$6,500 of $9,000</em>
          </div>
        </div>
      </div>

      <div className="col-md-7">
        <div className="chart-legend mb-2 d-flex flex-column">
          {feeLegend.map((item) => (
            <div key={item.id}>
              <span className={`k ${item.keyClass}`} />
              {item.label}
              <b>{item.value}</b>
            </div>
          ))}
        </div>
        <div className="d-flex gap-2 flex-wrap">
          {feeDiscounts.map((discount) => (
            <span className={`badge ${discount.className}`} key={discount.id}>
              <i className={`${discount.icon} me-1`} />
              {discount.label}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div className="info-list-item mt-3 bg-body-tertiary d-flex align-items-center">
      <span className="info-list-icon bg-body-secondary text-body-secondary flex-shrink-0">
        <i className="ti ti-calendar-due" />
      </span>
      <div className="info-list-body">
        <b>Next Installment · $2,000</b>
        <span>Term II Tuition · due 25 Dec 2024</span>
      </div>
      <div className="info-list-end flex-shrink-0 text-end d-flex flex-column align-items-end">
        <button
          type="button"
          className="action-button action-button-sm action-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"
          onClick={() => onOpenModal('pay')}
        >
          Pay
        </button>
      </div>
    </div>

    <h6 className="widget-subtitle mb-2 mt-3">
      <i className="ti ti-receipt me-1" />
      Payment History
    </h6>
    <div className="info-list d-flex flex-column">
      <InfoListRow
        row={paymentHistory[0]}
        endSlot={
          <>
            <b className="amount-value">$3,000</b>
            <Link
              to={routes.invoice}
              className="icon-action d-inline-flex align-items-center justify-content-center text-decoration-none"
              title="Receipt"
            >
              <i className="ti ti-download" />
            </Link>
          </>
        }
      />
      <InfoListRow
        row={paymentHistory[1]}
        endSlot={
          <>
            <span className="badge badge-soft-danger">$500</span>
            <button
              type="button"
              className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
              onClick={() => onOpenModal('pay')}
            >
              Pay
            </button>
          </>
        }
      />
    </div>
  </div>
);

export default FeeSummaryCard;
