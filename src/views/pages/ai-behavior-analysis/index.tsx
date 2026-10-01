import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import StatStrip from '../shared/StatStrip';
import ChartCard from '../shared/ChartCard';
import {
  actionOf,
  FLAGS,
  radarOptions,
  radarSeries,
  STATS,
  trendTint,
} from './data/behavior.data';

const routes = all_routes;

/** Where each derived action sends the reader. */
const ACTION_TO = { risk: routes.aiRiskDetection, discipline: routes.behaviorDiscipline };

const AiBehaviorAnalysis = () => {
  const { toasts, push, dismiss } = useToasts();

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-sparkles text-primary me-2" />
                AI Student Behavior Analysis
              </h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.aiCommandCenter}>AI</Link>
                  </li>
                  <li className="breadcrumb-item active">Behavior Analysis</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2"
                onClick={() => push('Behaviour analysis re-running')}
              >
                <i className="ti ti-refresh me-1" />
                Re-run
              </button>
              <ActionLink
                className="btn btn-primary mb-2"
                onClick={() => push('Behaviour analysis exported')}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </ActionLink>
            </div>
          </div>

          <StatStrip stats={STATS} />

          <div className="row">
            <ChartCard
              title="Behavior Dimensions"
              options={radarOptions}
              series={radarSeries}
              type="radar"
              height={300}
              span="col-12 col-xl-5"
            />

            <div className="col-12 col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <h4 className="mb-0">Flagged Students</h4>
                </div>
                <div className="card-body p-0 py-2">
                  <div className="table-responsive">
                    <table className="table table-nowrap mb-0">
                      <thead className="thead-light">
                        <tr>
                          <th>Student</th>
                          <th>Signal</th>
                          <th>Trend</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {FLAGS.map((flag) => {
                          const action = actionOf(flag.trend);

                          return (
                            <tr key={flag.id}>
                              <td>
                                <Link to={routes.studentDetail}>{flag.student}</Link>
                              </td>
                              <td>{flag.signal}</td>
                              <td>
                                <span className={`badge badge-soft-${trendTint(flag.trend)}`}>
                                  {flag.trend}
                                </span>
                              </td>
                              <td>
                                <Link to={ACTION_TO[action.target]} className="btn btn-sm btn-light">
                                  {action.label}
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="aiBehaviorToasts" />
    </>
  );
};

export default AiBehaviorAnalysis;
