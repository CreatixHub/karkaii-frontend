import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import {
  assignedUsers,
  assignmentFilters,
  assignmentStats,
  auditEntries,
  securityRows,
  securityScore,
} from '../data/rolesPermissions.data';

const routes = all_routes;

export interface UserAssignmentPanelProps {
  onAction: (action: string) => void;
}

const UserAssignmentPanel = ({ onAction }: UserAssignmentPanelProps) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>(
    Object.fromEntries(assignmentFilters.map((filter) => [filter.id, filter.options[0]])),
  );

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return assignedUsers.filter((user) => {
      if (term && !`${user.name} ${user.email} ${user.role}`.toLowerCase().includes(term)) return false;
      // The first option of each select is the "All …" pass-through.
      if (filters.departments !== assignmentFilters[0].options[0] && user.department !== filters.departments) {
        return false;
      }
      return true;
    });
  }, [search, filters]);

  return (
    <div className="row g-3 mt-1">
      {/* User Assignment */}
      <div className="col-12 col-xl-8 d-flex">
        <div className="card flex-fill mb-0">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-3">
            <h3 className="mb-0 d-flex align-items-center fs-16 fw-medium">
              <i className="ti ti-users text-primary me-2" />
              User Assignment
            </h3>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onAction('assign')}>
              <i className="ti ti-user-plus me-1" />
              Assign Users
            </button>
          </div>
          <div className="card-body">
            <div className="row g-3 mb-3">
              {assignmentStats.map((stat) => (
                <div className="col-6 col-md-3" key={stat.label}>
                  <p className="fs-12 text-muted mb-1">{stat.label}</p>
                  <h6 className="mb-0">
                    {stat.value}
                    {stat.suffix ? <span className="text-muted fw-normal fs-12"> {stat.suffix}</span> : null}
                  </h6>
                </div>
              ))}
            </div>

            <div className="row g-2 mb-3">
              <div className="col-sm-6 col-xl-3">
                <div className="directory-search">
                  <i className="ti ti-search" />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search user…"
                    aria-label="Search user…"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
              </div>
              {assignmentFilters.map((filter) => (
                <div className="col-sm-6 col-xl-3" key={filter.id}>
                  <select
                    className="form-select"
                    aria-label={filter.ariaLabel}
                    value={filters[filter.id]}
                    onChange={(event) => setFilters((current) => ({ ...current, [filter.id]: event.target.value }))}
                  >
                    {filter.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="thead-light">
                  <tr>
                    <th>User</th>
                    <th>Department</th>
                    <th>Current Role</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((user) => (
                    <tr key={user.email}>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-md rounded-circle flex-shrink-0 me-2">
                            <ImageWithBasePath src={user.avatar} alt="user" />
                          </span>
                          <div>
                            <h6 className="fs-14 fw-semibold mb-0">{user.name}</h6>
                            <span className="fs-12 text-muted">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>{user.department}</td>
                      <td>
                        <span className={`badge ${user.roleBadgeClass}`}>{user.role}</span>
                      </td>
                      <td className="text-end">
                        {user.assigned ? (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onAction('remove')}
                          >
                            <i className="ti ti-user-minus me-1" />
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => onAction('assign')}
                          >
                            <i className="ti ti-user-plus me-1" />
                            Assign
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
            <span className="fs-13 text-muted">Showing {rows.length} of 186 assigned users</span>
            <Link to={routes.staff} className="link-primary fs-13 fw-medium">
              View All Users
            </Link>
          </div>
        </div>
      </div>

      {/* Security Panel + Audit */}
      <div className="col-12 col-xl-4 d-flex">
        <div className="d-flex flex-column gap-3 flex-fill">
          <div className="card mb-0">
            <div className="card-header">
              <h5 className="mb-0 d-flex align-items-center">
                <i className="ti ti-shield-lock text-primary me-2" />
                Security Panel
              </h5>
            </div>
            <div className="card-body">
              <div className="score-block mb-3">
                <div className="text-center">
                  <div className="score-value">{securityScore}</div>
                  <div className="score-label">Score</div>
                </div>
              </div>
              {securityRows.map((row) => (
                <div className="section-row" key={row.label}>
                  <span className="section-label">
                    <i className={row.icon} />
                    {row.label}
                  </span>
                  <span className="fw-semibold">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card mb-0 flex-fill">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0 d-flex align-items-center">
                <i className="ti ti-history text-primary me-2" />
                Audit History
              </h5>
              <Link to="#" className="link-primary fs-13 fw-medium">
                View All
              </Link>
            </div>
            <div className="card-body">
              <div className="roles-timeline">
                {auditEntries.map((entry) => (
                  <div className="roles-timeline-item" key={entry.id}>
                    <span className={`roles-timeline-dot ${entry.dot}`}>
                      <i className={`${entry.icon} fs-10`} />
                    </span>
                    <p>
                      {entry.parts.map((part, index) =>
                        part.bold ? <b key={index}>{part.text}</b> : <span key={index}>{part.text}</span>,
                      )}
                    </p>
                    <span className="roles-timeline-meta">{entry.meta}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAssignmentPanel;
