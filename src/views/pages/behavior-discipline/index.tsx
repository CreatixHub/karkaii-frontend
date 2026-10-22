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
import type { Severity } from './data/behavior.data';
import {
  CATEGORIES,
  INCIDENT_LOG,
  pointsClassOf,
  pointsLabelOf,
  severityOf,
  severityTint,
  SEVERITIES,
  STATS,
  trendOptions,
  trendSeries,
  typesOptions,
  typesSeries,
} from './data/behavior.data';

const routes = all_routes;

const BehaviorDiscipline = () => {
  const { toasts, push, dismiss } = useToasts();

  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState<Severity | 'All'>('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<'incident' | 'merit' | null>(null);

  const [incident, setIncident] = useState({
    student: INCIDENT_LOG[0].student,
    category: CATEGORIES[0],
    severity: SEVERITIES[0] as string,
    points: '',
    action: '',
    notify: true,
  });
  const [merit, setMerit] = useState({ student: INCIDENT_LOG[1].student, reason: '', points: '' });

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return INCIDENT_LOG.filter((row) => {
      if (term && !row.student.toLowerCase().includes(term)) return false;
      if (severity !== 'All' && severityOf(row) !== severity) return false;
      return true;
    });
  }, [search, severity]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Behavior &amp; Discipline</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Students</li>
                  <li className="breadcrumb-item active">Behavior &amp; Discipline</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <ActionLink
                className="btn btn-outline-light bg-white me-2 mb-2"
                onClick={() => setDialog('merit')}
              >
                <i className="ti ti-plus me-1" />
                Award Merit
              </ActionLink>
              <ActionLink className="btn btn-primary mb-2" onClick={() => setDialog('incident')}>
                <i className="ti ti-square-rounded-plus me-1" />
                Log Incident
              </ActionLink>
            </div>
          </div>

          <StatStrip stats={STATS} />

          <div className="row">
            <ChartCard
              title="Merit vs Demerit Trend"
              options={trendOptions}
              series={trendSeries}
              type="line"
            />
            <ChartCard
              title="Incidents by Type"
              options={typesOptions}
              series={typesSeries}
              type="donut"
              height={290}
              span="col-12 col-xl-4"
            />
          </div>

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Incident Log</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <span className="icon-addon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search student..."
                    aria-label="Search student"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <div className={`dropdown mb-3${menuOpen ? ' show' : ''}`}>
                  <ActionLink
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <i className="ti ti-filter me-2" />
                    {severity === 'All' ? 'Severity' : severity}
                  </ActionLink>
                  <ul className={`dropdown-menu p-3${menuOpen ? ' show' : ''}`}>
                    {(['All', ...SEVERITIES] as (Severity | 'All')[]).map((option) => (
                      <li key={option}>
                        <ActionLink
                          className={`dropdown-item rounded-1${severity === option ? ' active' : ''}`}
                          onClick={() => {
                            setSeverity(option);
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
                      <th>Student</th>
                      <th>Class</th>
                      <th>Category</th>
                      <th>Severity</th>
                      <th>Action Taken</th>
                      <th>Points</th>
                      <th>Date</th>
                      <th className="no-sort">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((row) => {
                      const level = severityOf(row);
                      return (
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
                          <td>{row.category}</td>
                          <td>
                            <span className={`badge badge-soft-${severityTint(level)}`}>{level}</span>
                          </td>
                          <td>{row.action}</td>
                          <td className={pointsClassOf(row)}>{pointsLabelOf(row)}</td>
                          <td>{row.date}</td>
                          <td>
                            <ActionLink
                              className="btn btn-icon btn-sm btn-outline-light bg-white"
                              ariaLabel={`View ${row.student}`}
                              onClick={() => push(`${row.student} · ${row.category}`)}
                            >
                              <i className="ti ti-eye" />
                            </ActionLink>
                          </td>
                        </tr>
                      );
                    })}
                    {visible.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-muted fs-13">
                          No incidents match this search.
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
        open={dialog === 'incident'}
        onClose={() => setDialog(null)}
        title="Log Incident"
        onSubmit={(event) => {
          event.preventDefault();
          push('Incident logged');
          setDialog(null);
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Save Incident
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="bd-student">
              Student <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              id="bd-student"
              value={incident.student}
              onChange={(event) =>
                setIncident((state) => ({ ...state, student: event.target.value }))
              }
            >
              {INCIDENT_LOG.map((row) => (
                <option key={row.id}>{row.student}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="bd-category">
              Category
            </label>
            <select
              className="form-select"
              id="bd-category"
              value={incident.category}
              onChange={(event) =>
                setIncident((state) => ({ ...state, category: event.target.value }))
              }
            >
              {CATEGORIES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="bd-severity">
              Severity
            </label>
            <select
              className="form-select"
              id="bd-severity"
              value={incident.severity}
              onChange={(event) =>
                setIncident((state) => ({ ...state, severity: event.target.value }))
              }
            >
              {SEVERITIES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="bd-points">
              Points
            </label>
            <input
              type="text"
              className="form-control"
              id="bd-points"
              value={incident.points}
              onChange={(event) =>
                setIncident((state) => ({ ...state, points: event.target.value }))
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="bd-action">
              Action Taken
            </label>
            <input
              type="text"
              className="form-control"
              id="bd-action"
              value={incident.action}
              onChange={(event) =>
                setIncident((state) => ({ ...state, action: event.target.value }))
              }
            />
          </div>
          <div className="col-12">
            <div className="form-check mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                id="bd-notify"
                checked={incident.notify}
                onChange={() => setIncident((state) => ({ ...state, notify: !state.notify }))}
              />
              <label className="form-check-label fs-13" htmlFor="bd-notify">
                Notify Parent
              </label>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={dialog === 'merit'}
        onClose={() => setDialog(null)}
        title="Award Merit"
        onSubmit={(event) => {
          event.preventDefault();
          push('Merit awarded');
          setDialog(null);
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Award
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="bd-merit-student">
              Student
            </label>
            <select
              className="form-select"
              id="bd-merit-student"
              value={merit.student}
              onChange={(event) => setMerit((state) => ({ ...state, student: event.target.value }))}
            >
              {INCIDENT_LOG.map((row) => (
                <option key={row.id}>{row.student}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="bd-merit-reason">
              Reason
            </label>
            <input
              type="text"
              className="form-control"
              id="bd-merit-reason"
              value={merit.reason}
              onChange={(event) => setMerit((state) => ({ ...state, reason: event.target.value }))}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="bd-merit-points">
              Merit Points
            </label>
            <input
              type="text"
              className="form-control"
              id="bd-merit-points"
              value={merit.points}
              onChange={(event) => setMerit((state) => ({ ...state, points: event.target.value }))}
            />
          </div>
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="behaviorToasts" />
    </>
  );
};

export default BehaviorDiscipline;
