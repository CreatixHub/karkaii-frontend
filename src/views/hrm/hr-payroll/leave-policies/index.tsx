import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import PolicyCard from './components/PolicyCard';
import PolicySheet from './components/PolicySheet';
import {
  employeeCategoryOptions,
  leavePolicies,
  leaveTypeOptions,
  policyAlert,
  policyNotes,
  POLICY_YEAR,
  statusOptions,
} from './data/leavePolicies.data';

const routes = all_routes;

const LeavePolicies = () => {
  const [search, setSearch] = useState('');
  const [leaveType, setLeaveType] = useState(leaveTypeOptions[0]);
  const [category, setCategory] = useState(employeeCategoryOptions[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  // The template pre-selected the third card, Earned Leave.
  const [selectedId, setSelectedId] = useState('EL-03');

  const { toasts, push, dismiss } = useToasts();

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return leavePolicies.filter((policy) => {
      if (term && !`${policy.name} ${policy.code}`.toLowerCase().includes(term)) return false;
      if (leaveType !== leaveTypeOptions[0] && policy.type !== leaveType) return false;
      if (category !== employeeCategoryOptions[0] && policy.audience !== category) return false;
      if (status !== statusOptions[0] && policy.status !== status) return false;
      return true;
    });
  }, [search, leaveType, category, status]);

  // Keep the sheet on a card that is still on screen.
  const selected = visible.find((policy) => policy.id === selectedId) ?? visible[0] ?? null;

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Leave Policies</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">HRM</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Leave Policies
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <span className="badge badge-soft-bordered d-inline-flex align-items-center me-2 mb-2">
                <i className="ti ti-calendar-stats me-1" />
                {POLICY_YEAR}
              </span>
            </div>
          </div>
          {/* /Page Header */}

          {/* Top Toolbar */}
          <div className="card">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-xxl-4 col-lg-6">
                  <label className="form-label fs-12 mb-1" htmlFor="search">
                    Search
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="ti ti-search" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search policy name or code"
                      id="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </div>
                </div>
                <div className="col-xxl-2 col-lg-4 col-sm-6">
                  <label className="form-label fs-12 mb-1" htmlFor="leave-type">
                    Leave Type
                  </label>
                  <select
                    className="form-select"
                    id="leave-type"
                    value={leaveType}
                    onChange={(event) => setLeaveType(event.target.value)}
                  >
                    {leaveTypeOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="col-xxl-2 col-lg-4 col-sm-6">
                  <label className="form-label fs-12 mb-1" htmlFor="employee-category">
                    Employee Category
                  </label>
                  <select
                    className="form-select"
                    id="employee-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    {employeeCategoryOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="col-xxl-2 col-lg-4 col-sm-6">
                  <label className="form-label fs-12 mb-1" htmlFor="status">
                    Status
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="col-xxl-2 col-lg-12 col-sm-6">
                  <button
                    type="button"
                    className="btn btn-primary w-100 d-inline-flex align-items-center justify-content-center"
                    onClick={() => push('Policy editor is not wired to a backend yet', 'info')}
                  >
                    <i className="ti ti-square-rounded-plus me-1" />
                    Add Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* /Top Toolbar */}

          {/* Leave Policy Cards */}
          <div className="row">
            {visible.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                selected={selected?.id === policy.id}
                onSelect={() => setSelectedId(policy.id)}
              />
            ))}
          </div>
          {/* /Leave Policy Cards */}

          {visible.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mb-3">
                  <i className="ti ti-calendar-off fs-36" />
                </span>
                <h5 className="mb-1">No Leave Policies Found</h5>
                <p className="text-muted mb-0">No policy matches the selected filters. Adjust them to continue.</p>
              </div>
            </div>
          ) : null}

          {/* Policy Sheet */}
          {selected ? (
            <PolicySheet
              policy={selected}
              onPrint={() => window.print()}
              onEdit={() => push('Policy editor is not wired to a backend yet', 'info')}
            />
          ) : null}
          {/* /Policy Sheet */}

          {/* Notes */}
          <div className="card">
            <div className="card-body">
              <div className="alert alert-warning d-flex align-items-center mb-3" role="alert">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">{policyAlert}</span>
              </div>
              <div className="row g-3">
                {policyNotes.map((note) => (
                  <div className="col-12 col-lg-6" key={note}>
                    <div className="d-flex align-items-start">
                      <i className="ti ti-point-filled text-muted me-2 mt-1" />
                      <span className="fs-13">{note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* /Notes */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="lpToasts" />
    </>
  );
};

export default LeavePolicies;
