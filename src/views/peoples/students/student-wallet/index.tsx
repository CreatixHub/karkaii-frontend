import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import CommonSelect from '@core/common/commonSelect';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';

const routes = all_routes;

const statCards = [
  { id: 'balance', variant: 'stat-primary', icon: 'ti ti-wallet', iconClass: 'bg-primary-transparent text-primary', value: '$186K', label: 'Total Balance' },
  { id: 'credited', variant: 'stat-success', icon: 'ti ti-arrow-down-left', iconClass: 'bg-success-transparent text-success', badge: 'Today', badgeClass: 'badge-soft-success', value: '$4.2K', label: 'Credited' },
  { id: 'spent', variant: 'stat-danger', icon: 'ti ti-arrow-up-right', iconClass: 'bg-danger-transparent text-danger', value: '$2.8K', label: 'Spent' },
  { id: 'transactions', variant: 'stat-info', icon: 'ti ti-receipt', iconClass: 'bg-info-transparent text-info', value: '1,240', label: 'Transactions' },
  { id: 'low', variant: 'stat-warning', icon: 'ti ti-alert-triangle', iconClass: 'bg-warning-transparent text-warning', value: '64', label: 'Low Balance' },
  { id: 'refunds', variant: 'stat-secondary', icon: 'ti ti-arrow-back-up', iconClass: 'bg-secondary-transparent text-secondary', value: '$320', label: 'Refunds' },
];

const ledger = [
  { id: 'l1', photo: 'assets/img/students/student-01.jpg', student: 'Janet Daniel', description: 'Canteen purchase', type: 'Debit', typeClass: 'badge-soft-danger', amount: '-$12', amountClass: 'text-danger', balance: '$88', date: '08 Jul 2026' },
  { id: 'l2', photo: 'assets/img/students/student-02.jpg', student: 'George Kettut', description: 'Wallet top-up', type: 'Credit', typeClass: 'badge-soft-success', amount: '+$50', amountClass: 'text-success', balance: '$92', date: '08 Jul 2026' },
  { id: 'l3', photo: 'assets/img/students/student-03.jpg', student: 'Sophia Reyes', description: 'Library fine', type: 'Debit', typeClass: 'badge-soft-danger', amount: '-$5', amountClass: 'text-danger', balance: '$41', date: '07 Jul 2026' },
];

const trendOptions: ApexOptions = {
  chart: { type: 'area', height: 300, toolbar: { show: false } },
  xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  colors: ['#e7515a'],
  stroke: { curve: 'smooth', width: 3 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
  dataLabels: { enabled: false },
};

const trendSeries = [{ name: 'Spent ($)', data: [1800, 2100, 1900, 2400, 2200, 2800, 2600] }];

const TYPES = ['All', 'Credit', 'Debit'];
const TOPUP_STUDENTS = ['Janet Daniel', 'George Kettut'];
const TOPUP_MODES = ['Card', 'Cash', 'UPI'];

const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

const StudentWallet = () => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [typeOpen, setTypeOpen] = useState(false);
  const [topupOpen, setTopupOpen] = useState(false);
  const [topup, setTopup] = useState({ student: TOPUP_STUDENTS[0], amount: '', mode: TOPUP_MODES[0] });

  const { toasts, push, dismiss } = useToasts();

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ledger.filter(
      (row) =>
        (type === 'All' || row.type === type) &&
        (!term || row.student.toLowerCase().includes(term)),
    );
  }, [search, type]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Student Wallet</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Fees Collection</li>
                  <li className="breadcrumb-item active">Student Wallet</li>
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
                Statement
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2"
                onClick={() => setTopupOpen(true)}
              >
                <i className="ti ti-plus me-1" />
                Top-up
              </button>
            </div>
          </div>

          <div className="row g-3 mb-1">
            {statCards.map((card) => (
              <div className="col-xxl-2 col-lg-4 col-sm-6 d-flex" key={card.id}>
                <div className={`card stat-card ${card.variant} w-100`}>
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between">
                      <span className={`stat-icon ${card.iconClass}`}>
                        <i className={card.icon} />
                      </span>
                      {card.badge ? (
                        <span className={`badge ${card.badgeClass} fs-11`}>{card.badge}</span>
                      ) : null}
                    </div>
                    <h3 className="stat-value mt-3 mb-0">{card.value}</h3>
                    <p className="mb-0 text-muted fs-13">{card.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <h4 className="mb-0 fs-16 fw-medium">Spending Trend</h4>
                </div>
                <div className="card-body">
                  <div id="wl_trend">
                    <ReactApexChart
                      options={trendOptions}
                      series={trendSeries}
                      type="area"
                      height={300}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Wallet Ledger</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <span className="icon-addon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search student..."
                    aria-label="Search student..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <div className="dropdown mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    aria-expanded={typeOpen}
                    onClick={() => setTypeOpen((open) => !open)}
                  >
                    <i className="ti ti-filter me-2" />
                    Type
                  </button>
                  <ul className={`dropdown-menu p-3${typeOpen ? ' show' : ''}`}>
                    {TYPES.map((option) => (
                      <li key={option}>
                        <button
                          type="button"
                          className={`dropdown-item rounded-1${type === option ? ' active' : ''}`}
                          onClick={() => {
                            setType(option);
                            setTypeOpen(false);
                          }}
                        >
                          {option}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="card-body p-0 py-3">
              <div className="custom-datatable-filter table-responsive">
                <table className="table datatable">
                  <thead className="thead-light">
                    <tr>
                      <th>Student</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Balance</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <Link to={routes.studentDetail} className="avatar avatar-sm me-2">
                              <ImageWithBasePath
                                src={row.photo}
                                className="rounded-circle flex-shrink-0"
                                alt={row.student}
                              />
                            </Link>
                            {row.student}
                          </div>
                        </td>
                        <td>{row.description}</td>
                        <td>
                          <span className={`badge ${row.typeClass}`}>{row.type}</span>
                        </td>
                        <td className={row.amountClass}>{row.amount}</td>
                        <td>{row.balance}</td>
                        <td>{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Top-up */}
      <Modal
        open={topupOpen}
        onClose={() => setTopupOpen(false)}
        title="Wallet Top-up"
        onSubmit={(event) => {
          event.preventDefault();
          setTopupOpen(false);
          push('Wallet topped up successfully');
        }}
        footer={
          <>
            <button
              type="button"
              className="btn btn-light me-2"
              onClick={() => setTopupOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Top-up
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="student">
            Student
          </label>
          <CommonSelect
            inputId="student"
            options={toOptions(TOPUP_STUDENTS)}
            value={{ value: topup.student, label: topup.student }}
            onChange={(option) =>
              setTopup((current) => ({ ...current, student: option?.value ?? '' }))
            }
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="amount">
            Amount
          </label>
          <input
            type="text"
            className="form-control"
            id="amount"
            value={topup.amount}
            onChange={(event) => setTopup((current) => ({ ...current, amount: event.target.value }))}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="mode">
            Mode
          </label>
          <CommonSelect
            inputId="mode"
            options={toOptions(TOPUP_MODES)}
            value={{ value: topup.mode, label: topup.mode }}
            onChange={(option) => setTopup((current) => ({ ...current, mode: option?.value ?? '' }))}
          />
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

export default StudentWallet;
