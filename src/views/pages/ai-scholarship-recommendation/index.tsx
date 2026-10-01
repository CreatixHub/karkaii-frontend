import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import StatStrip from '../shared/StatStrip';
import ChartCard from '../shared/ChartCard';
import {
  fitTint,
  MATCHES,
  matchOptions,
  matchSeries,
  money,
  STATS,
} from './data/recommendations.data';

const routes = all_routes;

const AiScholarshipRecommendation = () => {
  const { toasts, push, dismiss } = useToasts();

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-sparkles text-primary me-2" />
                AI Scholarship Recommendation
              </h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.aiCommandCenter}>AI</Link>
                  </li>
                  <li className="breadcrumb-item active">Scholarship Recommendation</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2"
                onClick={() => push('Recommendations re-running')}
              >
                <i className="ti ti-refresh me-1" />
                Re-run
              </button>
              <ActionLink
                className="btn btn-primary mb-2"
                onClick={() => push('Recommendations exported')}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </ActionLink>
            </div>
          </div>

          <StatStrip stats={STATS} />

          <div className="row">
            <div className="col-12 col-xl-8 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <h4 className="mb-0">Recommended Matches</h4>
                </div>
                <div className="card-body p-0 py-2">
                  <div className="table-responsive">
                    <table className="table table-nowrap mb-0">
                      <thead className="thead-light">
                        <tr>
                          <th>Student</th>
                          <th>Scheme</th>
                          <th>Fit Score</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MATCHES.map((match) => (
                          <tr key={match.id}>
                            <td>
                              <Link to={routes.studentDetail}>{match.student}</Link>
                            </td>
                            <td>{match.scheme}</td>
                            <td>
                              <span className={`badge badge-soft-${fitTint(match.fit)}`}>
                                {match.fit}%
                              </span>
                            </td>
                            <td>{money(match.amount)}</td>
                            <td>
                              <Link
                                to={routes.scholarshipManagement}
                                className="btn btn-sm btn-primary"
                              >
                                Award
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <ChartCard
              title="Match Distribution"
              options={matchOptions}
              series={matchSeries}
              type="donut"
              height={290}
              span="col-12 col-xl-4"
            />
          </div>
        </div>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="aiScholarshipToasts" />
    </>
  );
};

export default AiScholarshipRecommendation;
