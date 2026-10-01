import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import DateField from '@components/ui/DateField';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import StatStrip from '../shared/StatStrip';
import ChartCard from '../shared/ChartCard';
import {
  chartOptions,
  chartSeries,
  CLASSES,
  LATE_FEE_RULES,
  money,
  PLANS,
  progressOf,
  progressTintOf,
  SCHEDULE,
  scheduleStatusOf,
  scheduleTintOf,
  STATS,
} from './data/installments.data';

const routes = all_routes;

const FeeInstallments = () => {
  const { toasts, push, dismiss } = useToasts();

  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState<'create' | 'schedule' | null>(null);
  const [plan, setPlan] = useState({
    name: '',
    className: CLASSES[0],
    installments: '',
    total: '',
    lateFee: LATE_FEE_RULES[0],
    firstDue: '',
  });

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? PLANS.filter((row) => row.name.toLowerCase().includes(term)) : PLANS;
  }, [search]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Fee Installments &amp; Plans</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Fees Collection</li>
                  <li className="breadcrumb-item active">Installments &amp; Plans</li>
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
                onClick={() => push('Installment plans exported')}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </ActionLink>
              <ActionLink className="btn btn-primary mb-2" onClick={() => setDialog('create')}>
                <i className="ti ti-square-rounded-plus me-1" />
                Create Plan
              </ActionLink>
            </div>
          </div>

          <StatStrip stats={STATS} />

          <div className="row">
            <ChartCard
              title="Collection vs Due (by Installment)"
              options={chartOptions}
              series={chartSeries}
              type="bar"
              span="col-12"
            />
          </div>

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Installment Plans</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <span className="icon-addon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search plan..."
                    aria-label="Search plan"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              <div className="custom-datatable-filter table-responsive">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th>Plan</th>
                      <th>Class</th>
                      <th>Installments</th>
                      <th>Total</th>
                      <th>Collected</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th className="no-sort">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <ActionLink
                            className="link-primary"
                            onClick={() => setDialog('schedule')}
                          >
                            {row.name}
                          </ActionLink>
                        </td>
                        <td>{row.className}</td>
                        <td>{row.installments}</td>
                        <td>{money(row.total)}</td>
                        <td>{money(row.collected)}</td>
                        <td>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label={`${row.name} collected`}
                            aria-valuenow={progressOf(row)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            style={{ height: '6px', width: '100px' }}
                          >
                            <div
                              className={`progress-bar bg-${progressTintOf(row)}`}
                              style={{ width: `${progressOf(row)}%` }}
                            />
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge badge-soft-${row.active ? 'success' : 'secondary'} d-inline-flex align-items-center`}
                          >
                            <i className="ti ti-circle-filled fs-5 me-1" />
                            {row.active ? 'Active' : 'Closed'}
                          </span>
                        </td>
                        <td>
                          <ActionLink
                            className="btn btn-icon btn-sm btn-outline-light bg-white"
                            ariaLabel={`Schedule for ${row.name}`}
                            onClick={() => setDialog('schedule')}
                          >
                            <i className="ti ti-eye" />
                          </ActionLink>
                        </td>
                      </tr>
                    ))}
                    {visible.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-muted fs-13">
                          No plans match this search.
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
        open={dialog === 'create'}
        onClose={() => setDialog(null)}
        title="Create Installment Plan"
        onSubmit={(event) => {
          event.preventDefault();
          push('Installment plan created');
          setDialog(null);
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Create Plan
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="fi-name">
              Plan Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="fi-name"
              value={plan.name}
              onChange={(event) => setPlan((state) => ({ ...state, name: event.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="fi-class">
              Class
            </label>
            <select
              className="form-select"
              id="fi-class"
              value={plan.className}
              onChange={(event) => setPlan((state) => ({ ...state, className: event.target.value }))}
            >
              {CLASSES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="fi-count">
              No. of Installments
            </label>
            <input
              type="text"
              className="form-control"
              id="fi-count"
              value={plan.installments}
              onChange={(event) =>
                setPlan((state) => ({ ...state, installments: event.target.value }))
              }
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="fi-total">
              Total Amount
            </label>
            <input
              type="text"
              className="form-control"
              id="fi-total"
              value={plan.total}
              onChange={(event) => setPlan((state) => ({ ...state, total: event.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="fi-late">
              Late Fee Rule
            </label>
            <select
              className="form-select"
              id="fi-late"
              value={plan.lateFee}
              onChange={(event) => setPlan((state) => ({ ...state, lateFee: event.target.value }))}
            >
              {LATE_FEE_RULES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">First Due Date</label>
            <DateField
              value={plan.firstDue}
              onChange={(value) => setPlan((state) => ({ ...state, firstDue: value }))}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={dialog === 'schedule'}
        onClose={() => setDialog(null)}
        title="Installment Schedule"
        footer={
          <ActionLink className="btn btn-light" onClick={() => setDialog(null)}>
            Close
          </ActionLink>
        }
      >
        <div className="table-responsive">
          <table className="table table-nowrap mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {SCHEDULE.map((row) => (
                <tr key={row.number}>
                  <td className="fs-13">{row.number}</td>
                  <td className="fs-13">{row.dueOn}</td>
                  <td className="fs-13">{money(row.amount)}</td>
                  <td>
                    <span className={`badge badge-soft-${scheduleTintOf(row)}`}>
                      {scheduleStatusOf(row)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="feeInstallmentsToasts" />
    </>
  );
};

export default FeeInstallments;
