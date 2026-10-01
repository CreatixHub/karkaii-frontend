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
  actionTint,
  DETAIL,
  moduleOptions,
  moduleSeries,
  MODULES,
  RANGE,
  STATS,
  TRAIL,
  typeOptions,
  typeSeries,
} from './data/audit.data';

const routes = all_routes;

const AuditLog = () => {
  const { toasts, push, dismiss } = useToasts();

  const [module, setModule] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const visible = useMemo(
    () => (module === 'All' ? TRAIL : TRAIL.filter((row) => row.module === module)),
    [module],
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Audit Log</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">User Management</li>
                  <li className="breadcrumb-item active">Audit Log</li>
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
              <ActionLink className="btn btn-primary mb-2" onClick={() => push('Audit log exported')}>
                <i className="ti ti-file-export me-1" />
                Export Log
              </ActionLink>
            </div>
          </div>

          <StatStrip stats={STATS} />

          <div className="row">
            <ChartCard
              title="Activity by Module"
              options={moduleOptions}
              series={moduleSeries}
              type="bar"
            />
            <ChartCard
              title="Event Types"
              options={typeOptions}
              series={typeSeries}
              type="donut"
              height={290}
              span="col-12 col-xl-4"
            />
          </div>

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Audit Trail</h4>
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
                    aria-label="Select date"
                  />
                </div>
                <div className={`dropdown mb-3${menuOpen ? ' show' : ''}`}>
                  <ActionLink
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <i className="ti ti-filter me-2" />
                    {module === 'All' ? 'Module' : module}
                  </ActionLink>
                  <ul className={`dropdown-menu p-3${menuOpen ? ' show' : ''}`}>
                    {['All', ...MODULES].map((option) => (
                      <li key={option}>
                        <ActionLink
                          className={`dropdown-item rounded-1${module === option ? ' active' : ''}`}
                          onClick={() => {
                            setModule(option);
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
                      <th>User</th>
                      <th>Action</th>
                      <th>Module</th>
                      <th>IP</th>
                      <th>Timestamp</th>
                      <th className="no-sort">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-sm me-2">
                              <ImageWithBasePath
                                src={row.photo}
                                className="rounded-circle flex-shrink-0"
                                alt={row.user}
                              />
                            </span>
                            {row.user}
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-soft-${actionTint(row.action)}`}>
                            {row.action}
                          </span>
                        </td>
                        <td>{row.module}</td>
                        <td>{row.ip}</td>
                        <td>{row.at}</td>
                        <td>
                          <ActionLink
                            className="btn btn-icon btn-sm btn-outline-light bg-white"
                            ariaLabel={`Details for ${row.user}`}
                            onClick={() => setDetailOpen(true)}
                          >
                            <i className="ti ti-eye" />
                          </ActionLink>
                        </td>
                      </tr>
                    ))}
                    {visible.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted fs-13">
                          No events for this module today.
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
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Audit Detail"
        footer={
          <ActionLink className="btn btn-light" onClick={() => setDetailOpen(false)}>
            Close
          </ActionLink>
        }
      >
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <span className="fs-12 text-muted d-block">User</span>
            <span className="fs-13 fw-medium">{DETAIL.user}</span>
          </div>
          <div className="col-md-6">
            <span className="fs-12 text-muted d-block">Action</span>
            <span className="fs-13 fw-medium">{DETAIL.action}</span>
          </div>
          <div className="col-md-6">
            <span className="fs-12 text-muted d-block">Module</span>
            <span className="fs-13 fw-medium">{DETAIL.module}</span>
          </div>
          <div className="col-md-6">
            <span className="fs-12 text-muted d-block">IP</span>
            <span className="fs-13 fw-medium">{DETAIL.ip}</span>
          </div>
        </div>
        <h6 className="fs-14 mb-2">Changes</h6>
        <div className="table-responsive">
          <table className="table table-nowrap mb-0">
            <thead>
              <tr>
                <th>Field</th>
                <th>Before</th>
                <th>After</th>
              </tr>
            </thead>
            <tbody>
              {DETAIL.changes.map((change) => (
                <tr key={change.field}>
                  <td className="fs-13">{change.field}</td>
                  <td className="fs-13 text-muted">{change.before}</td>
                  <td className="fs-13">{change.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="auditLogToasts" />
    </>
  );
};

export default AuditLog;
