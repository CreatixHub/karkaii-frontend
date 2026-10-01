import { BlockHeading, Counter } from '../primitives';
import type { ProfileModalId } from '../../data/studentProfileActions';

export interface PaymentTarget {
  label: string;
  amount: number;
}

const STATS = [
  { id: 'total', accent: 'accent-primary', icon: 'ti ti-wallet', value: '$9,000', label: 'Total Fees' },
  { id: 'paid', accent: 'accent-success', icon: 'ti ti-circle-check', value: '$6,500', label: 'Paid', mini: { width: 72, color: '#16a34a' } },
  { id: 'pending', accent: 'accent-warning', icon: 'ti ti-clock-dollar', value: '$2,000', label: 'Pending', mini: { width: 22, color: '#d97706' } },
  { id: 'overdue', accent: 'accent-danger', icon: 'ti ti-alert-triangle', value: '$500', label: 'Overdue', mini: { width: 6, color: '#dc2626' } },
];

const INVOICES = [
  { id: 'inv2043', tint: 'bg-warning-transparent', title: 'Term II Tuition', sub: '#INV-2043 · 01 Dec 2024', amount: '$2,000', pill: 'warn', status: 'Pending', pay: { label: 'Term II Tuition (#INV-2043)', amount: 2000 } },
  { id: 'inv1988', tint: 'bg-danger-transparent', title: 'Transport Fee', sub: '#INV-1988 · 02 Nov 2024', amount: '$500', pill: 'bad', status: 'Overdue', pay: { label: 'Transport Fee (#INV-1988)', amount: 500 } },
  { id: 'inv1902', tint: 'bg-success-transparent', title: 'Term I Tuition', sub: '#INV-1902 · 05 Sep 2024', amount: '$3,000', pill: 'ok', status: 'Paid' },
  { id: 'inv1855', tint: 'bg-success-transparent', title: 'Admission Fee', sub: '#INV-1855 · 18 Mar 2024', amount: '$3,500', pill: 'ok', status: 'Paid' },
];

const TIMELINE = [
  { id: 't1', accent: 'accent-success', icon: 'ti ti-cash', time: '05 Sep 2024', title: '$3,000 Paid', desc: 'Term I Tuition · Card ····4521' },
  { id: 't2', accent: 'accent-success', icon: 'ti ti-cash', time: '18 Mar 2024', title: '$3,500 Paid', desc: 'Admission Fee · Bank Transfer' },
  { id: 't3', accent: 'accent-warning', icon: 'ti ti-clock', time: '01 Dec 2024', title: '$2,000 Pending', desc: 'Term II Tuition · Awaiting payment' },
];

export interface FeesPaneProps {
  revealed: boolean;
  onPay: (target: PaymentTarget) => void;
  onOpenModal: (modal: ProfileModalId) => void;
  onDownloadDoc: (name: string) => void;
}

const FeesPane = ({ revealed, onPay, onOpenModal, onDownloadDoc }: FeesPaneProps) => (
  <div id="profile-pane-fees" className="tab-pane-block active" data-pane="fees" role="tabpanel">
    {/* Due payment banner */}
    <div className="fee-banner">
      <span className="avatar avatar-icon avatar-lg avatar-accent">
        <i className="ti ti-calendar-due" />
      </span>
      <div className="fee-banner-txt">
        <b>Next Payment Due</b>
        <span>
          Term II Tuition · <strong>$2,000</strong> · due 25 Dec 2024
        </span>
      </div>
      <div className="d-flex gap-2 ms-auto flex-wrap">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onPay({ label: 'Term II Tuition + Transport', amount: 2500 })}
        >
          <i className="ti ti-credit-card me-1" />
          Pay Now
        </button>
        <button
          type="button"
          className="btn btn-light btn-sm"
          onClick={() => onOpenModal('collectFees')}
        >
          <i className="ti ti-cash me-1" />
          Collect Fees
        </button>
      </div>
    </div>

    <div className="row g-3 mb-1">
      {/* Donut */}
      <div className="col-12 col-xl-12">
        <div className="fee-donut-card">
          <div className="fee-donut">
            <svg viewBox="0 0 140 140">
              <circle className="track" cx="70" cy="70" r="54" />
              <circle cx="70" cy="70" r="54" stroke="#16a34a" strokeDasharray="245.1 339" strokeDashoffset="0" />
              <circle cx="70" cy="70" r="54" stroke="#d97706" strokeDasharray="75.4 339" strokeDashoffset="-245.1" />
              <circle cx="70" cy="70" r="54" stroke="#dc2626" strokeDasharray="18.9 339" strokeDashoffset="-320.5" />
            </svg>
            <div className="fee-donut-center">
              <span className="pct">
                <Counter value={72} suffix="%" revealed={revealed} />
              </span>
              <span className="lbl">Collected</span>
            </div>
          </div>
          <div className="donut-legend">
            <div>
              <span className="k" style={{ background: '#16a34a' }} />
              Paid <b>$6,500</b>
            </div>
            <div>
              <span className="k" style={{ background: '#d97706' }} />
              Pending <b>$2,000</b>
            </div>
            <div>
              <span className="k" style={{ background: '#dc2626' }} />
              Overdue <b>$500</b>
            </div>
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="col-12 col-xl-12">
        <div className="fee-stats">
          {STATS.map((stat) => (
            <div className={`fee-stat ${stat.accent}`} key={stat.id}>
              <span className="avatar avatar-icon avatar-accent-soft">
                <i className={stat.icon} />
              </span>
              <div className="fee-stat-body">
                <div className="v">{stat.value}</div>
                <div className="l">{stat.label}</div>
                {stat.mini ? (
                  <div className="fee-mini">
                    <span
                      style={{
                        width: revealed ? `${stat.mini.width}%` : 0,
                        background: stat.mini.color,
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="fee-progress">
          <div className="top">
            <span>Collection Progress</span>
            <b>$6,500 / $9,000</b>
          </div>
          <div className="profile-bar">
            <span
              style={{
                width: revealed ? '72%' : 0,
                background: 'linear-gradient(90deg,#16a34a,#22c55e)',
              }}
            />
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap mt-3">
          <span className="profile-pill info">
            <i className="ti ti-award" />
            Scholarship 15%
          </span>
          <span className="profile-pill ok">
            <i className="ti ti-discount" />
            Sibling Discount 5%
          </span>
        </div>
      </div>
    </div>

    <div className="row g-3 mt-1">
      {/* Invoices */}
      <div className="col-12 col-xl-12">
        <BlockHeading icon="ti ti-file-invoice">Invoices</BlockHeading>
        <div className="fee-invoices">
          {INVOICES.map((invoice) => (
            <div className="profile-invoice" key={invoice.id}>
              <span className={`avatar avatar-icon avatar-md ${invoice.tint}`}>
                <i className="ti ti-file-dollar" />
              </span>
              <div className="invoice-main">
                <div className="invoice-title">{invoice.title}</div>
                <div className="invoice-sub">{invoice.sub}</div>
              </div>
              <div className="invoice-amt">
                {invoice.amount}
                <span className={`profile-pill ${invoice.pill}`}>{invoice.status}</span>
              </div>
              {invoice.pay ? (
                <button
                  type="button"
                  className="profile-button profile-button-sm profile-button-primary"
                  onClick={() => onPay({ label: invoice.pay.label, amount: invoice.pay.amount })}
                >
                  <i className="ti ti-credit-card" />
                  Pay
                </button>
              ) : null}
              <button
                type="button"
                className="profile-button profile-icon-button"
                title="Download"
                aria-label={`Download ${invoice.title}`}
                onClick={() => onDownloadDoc(invoice.title)}
              >
                <i className="ti ti-download" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment timeline */}
      <div className="col-12 col-xl-12">
        <BlockHeading icon="ti ti-history">Payment Timeline</BlockHeading>
        <div className="profile-timeline">
          {TIMELINE.map((entry) => (
            <div className="profile-timeline" key={entry.id}>
              <span className={`avatar avatar-icon avatar-sm avatar-rounded avatar-accent-soft ${entry.accent}`}>
                <i className={entry.icon} />
              </span>
              <div className="profile-timeline-time">{entry.time}</div>
              <div className="timeline-title">{entry.title}</div>
              <div className="timeline-desc">{entry.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default FeesPane;
