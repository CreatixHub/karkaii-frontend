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
import {
  APPLICATIONS,
  budgetOptions,
  budgetSeries,
  money,
  SCHEME_TYPES,
  stateTint,
  STATS,
} from './data/scholarships.data';

const routes = all_routes;

const ScholarshipManagement = () => {
  const { toasts, push, dismiss } = useToasts();

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: SCHEME_TYPES[0],
    budget: '',
    criteria: '',
  });

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? APPLICATIONS.filter(
          (row) =>
            row.student.toLowerCase().includes(term) || row.scheme.toLowerCase().includes(term),
        )
      : APPLICATIONS;
  }, [search]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Scholarship Management</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Fees Collection</li>
                  <li className="breadcrumb-item active">Scholarships</li>
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
              <ActionLink className="btn btn-primary mb-2" onClick={() => setOpen(true)}>
                <i className="ti ti-square-rounded-plus me-1" />
                New Scheme
              </ActionLink>
            </div>
          </div>

          <StatStrip stats={STATS} />

          <div className="row">
            <ChartCard
              title="Budget Utilization by Scheme"
              options={budgetOptions}
              series={budgetSeries}
              type="bar"
              span="col-12"
            />
          </div>

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Applications</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <span className="icon-addon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    aria-label="Search applications"
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
                      <th>Student</th>
                      <th>Class</th>
                      <th>Scheme</th>
                      <th>Amount</th>
                      <th>Criteria</th>
                      <th>Status</th>
                      <th className="no-sort">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((row) => (
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
                            <Link to={routes.studentDetail} className="text-dark">
                              {row.student}
                            </Link>
                          </div>
                        </td>
                        <td>{row.className}</td>
                        <td>{row.scheme}</td>
                        <td>{money(row.amount)}</td>
                        <td>
                          <span className="badge badge-light text-dark">{row.criteria}</span>
                        </td>
                        <td>
                          <span
                            className={`badge badge-soft-${stateTint(row.state)} d-inline-flex align-items-center`}
                          >
                            <i className="ti ti-circle-filled fs-5 me-1" />
                            {row.state}
                          </span>
                        </td>
                        <td>
                          <ActionLink
                            className="btn btn-icon btn-sm btn-outline-light bg-white"
                            ariaLabel={`View ${row.student}`}
                            onClick={() => push(`${row.student} · ${row.scheme}`)}
                          >
                            <i className="ti ti-eye" />
                          </ActionLink>
                        </td>
                      </tr>
                    ))}
                    {visible.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-muted fs-13">
                          No applications match this search.
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
        open={open}
        onClose={() => setOpen(false)}
        title="New Scholarship Scheme"
        onSubmit={(event) => {
          event.preventDefault();
          push('Scholarship scheme created');
          setOpen(false);
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setOpen(false)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="sc-name">
              Scheme Name
            </label>
            <input
              type="text"
              className="form-control"
              id="sc-name"
              value={form.name}
              onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sc-type">
              Type
            </label>
            <select
              className="form-select"
              id="sc-type"
              value={form.type}
              onChange={(event) => setForm((state) => ({ ...state, type: event.target.value }))}
            >
              {SCHEME_TYPES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sc-budget">
              Budget
            </label>
            <input
              type="text"
              className="form-control"
              id="sc-budget"
              value={form.budget}
              onChange={(event) => setForm((state) => ({ ...state, budget: event.target.value }))}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="sc-criteria">
              Eligibility Criteria
            </label>
            <textarea
              className="form-control"
              rows={2}
              id="sc-criteria"
              value={form.criteria}
              onChange={(event) => setForm((state) => ({ ...state, criteria: event.target.value }))}
            />
          </div>
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="scholarshipToasts" />
    </>
  );
};

export default ScholarshipManagement;
