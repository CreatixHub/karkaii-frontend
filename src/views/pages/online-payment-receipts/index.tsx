import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import StatStrip from '../shared/StatStrip';
import ChartCard from '../shared/ChartCard';
import type { PaymentState } from './data/payments.data';
import {
  GATEWAYS,
  hasReceiptOf,
  modeOptions,
  modeSeries,
  money,
  RANGE,
  RECEIPT,
  STATES,
  stateTint,
  STATS,
  TRANSACTIONS,
  trendOptions,
  trendSeries,
} from './data/payments.data';

const routes = all_routes;

const OnlinePaymentReceipts = () => {
  const { toasts, push, dismiss } = useToasts();

  const [state, setState] = useState<PaymentState | 'All'>('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<'pay' | 'receipt' | null>(null);
  const [payment, setPayment] = useState({
    student: TRANSACTIONS[0].student,
    amount: '',
    gateway: GATEWAYS[0],
  });

  const visible = useMemo(
    () => (state === 'All' ? TRANSACTIONS : TRANSACTIONS.filter((row) => row.state === state)),
    [state],
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Online Payment &amp; Receipts</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Fees Collection</li>
                  <li className="breadcrumb-item active">Online Payment</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2"
                onClick={() => window.print()}
              >
                <i className="ti ti-printer me-1" />
                Print
              </button>
              <ActionLink
                className="btn btn-outline-light bg-white me-2 mb-2"
                onClick={() => push('Reconciliation started against the bank feed')}
              >
                <i className="ti ti-refresh me-1" />
                Reconciliation
              </ActionLink>
              <ActionLink className="btn btn-primary mb-2" onClick={() => setDialog('pay')}>
                <i className="ti ti-square-rounded-plus me-1" />
                New Payment
              </ActionLink>
            </div>
          </div>

          <StatStrip stats={STATS} />

          <div className="row">
            <ChartCard
              title="Daily Collection Trend"
              options={trendOptions}
              series={trendSeries}
              type="area"
            />
            <ChartCard
              title="Payment Modes"
              options={modeOptions}
              series={modeSeries}
              type="donut"
              height={290}
              span="col-12 col-xl-4"
            />
          </div>

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Transactions</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <span className="icon-addon">
                    <i className="ti ti-calendar" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Select"
                    defaultValue={RANGE}
                    aria-label="Select date range"
                  />
                </div>
                <div className={`dropdown mb-3${menuOpen ? ' show' : ''}`}>
                  <ActionLink
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <i className="ti ti-filter me-2" />
                    {state === 'All' ? 'Status' : state}
                  </ActionLink>
                  <ul className={`dropdown-menu p-3${menuOpen ? ' show' : ''}`}>
                    {(['All', ...STATES] as (PaymentState | 'All')[]).map((option) => (
                      <li key={option}>
                        <ActionLink
                          className={`dropdown-item rounded-1${state === option ? ' active' : ''}`}
                          onClick={() => {
                            setState(option);
                            setMenuOpen(false);
                          }}
                        >
                          {option}
                        </ActionLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              <div className="custom-datatable-filter table-responsive">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th>Txn ID</th>
                      <th>Student</th>
                      <th>Amount</th>
                      <th>Mode</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th className="no-sort">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <ActionLink
                            className="link-primary"
                            onClick={() => push(`${row.id} · ${row.mode}`)}
                          >
                            {row.id}
                          </ActionLink>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-sm me-2">
                              <ImageWithBasePath
                                src={row.photo}
                                className="rounded-circle flex-shrink-0"
                                alt={row.student}
                              />
                            </span>
                            {row.student}
                          </div>
                        </td>
                        <td>{money(row.amount)}</td>
                        <td>{row.mode}</td>
                        <td>{row.date}</td>
                        <td>
                          <span
                            className={`badge badge-soft-${stateTint(row.state)} d-inline-flex align-items-center`}
                          >
                            <i className="ti ti-circle-filled fs-5 me-1" />
                            {row.state}
                          </span>
                        </td>
                        <td>
                          {hasReceiptOf(row) ? (
                            <ActionLink
                              className="btn btn-icon btn-sm btn-outline-light bg-white"
                              ariaLabel={`Receipt for ${row.id}`}
                              onClick={() => setDialog('receipt')}
                            >
                              <i className="ti ti-receipt" />
                            </ActionLink>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))}
                    {visible.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-muted fs-13">
                          No transactions with this status.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={dialog === 'pay'}
        onClose={() => setDialog(null)}
        title="New Payment"
        onSubmit={(event) => {
          event.preventDefault();
          push('Payment sent to the gateway');
          setDialog(null);
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Proceed to Pay
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="op-student">
              Student
            </label>
            <select
              className="form-select"
              id="op-student"
              value={payment.student}
              onChange={(event) =>
                setPayment((current) => ({ ...current, student: event.target.value }))
              }
            >
              {TRANSACTIONS.map((row) => (
                <option key={row.id}>{row.student}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="op-amount">
              Amount
            </label>
            <input
              type="text"
              className="form-control"
              id="op-amount"
              value={payment.amount}
              onChange={(event) =>
                setPayment((current) => ({ ...current, amount: event.target.value }))
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="op-gateway">
              Payment Gateway
            </label>
            <select
              className="form-select"
              id="op-gateway"
              value={payment.gateway}
              onChange={(event) =>
                setPayment((current) => ({ ...current, gateway: event.target.value }))
              }
            >
              {GATEWAYS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        open={dialog === 'receipt'}
        onClose={() => setDialog(null)}
        title="Receipt"
        bodyClassName="text-center"
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Close
            </ActionLink>
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              Print
            </button>
          </>
        }
      >
        <h5 className="fs-16 mb-1">{RECEIPT.school}</h5>
        <p className="fs-13 text-muted mb-3">{RECEIPT.title}</p>
        <div className="text-start">
          <div className="d-flex align-items-center justify-content-between py-2 border-bottom">
            <span className="fs-13 text-muted">Receipt No</span>
            <span className="fs-13 fw-medium">{RECEIPT.number}</span>
          </div>
          <div className="d-flex align-items-center justify-content-between py-2 border-bottom">
            <span className="fs-13 text-muted">Student</span>
            <span className="fs-13 fw-medium">{RECEIPT.student}</span>
          </div>
          <div className="d-flex align-items-center justify-content-between py-2 border-bottom">
            <span className="fs-13 text-muted">Amount</span>
            <span className="fs-13 fw-medium">{RECEIPT.amount}</span>
          </div>
          <div className="d-flex align-items-center justify-content-between py-2">
            <span className="fs-13 text-muted">Status</span>
            <span className="badge badge-soft-success">{RECEIPT.status}</span>
          </div>
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="onlinePaymentToasts" />
    </>
  );
};

export default OnlinePaymentReceipts;
