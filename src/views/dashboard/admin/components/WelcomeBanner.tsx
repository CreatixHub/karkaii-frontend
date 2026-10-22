import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import { welcomeKpis } from '../data/adminDashboard.data';

const routes = all_routes;

function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const WelcomeBanner = () => {
  const { greeting, formattedDate } = useMemo(() => {
    const now = new Date();
    return {
      greeting: greetingForHour(now.getHours()),
      formattedDate: now.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };
  }, []);

  return (
    <div className="row g-4">
      <div className="col-12 d-flex">
        <div className="card flex-fill welcome-banner mb-4">
          <div className="card-body">
            <div className="row g-4 align-items-center">
              {/* Greeting + CTAs */}
              <div className="col-xxl-5 col-lg-12">
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-icon avatar-xl welcome-banner-brand me-3">
                    <i className="ti ti-school" />
                  </span>
                  <div>
                    <h2 className="mb-1">{greeting}, Administrator</h2>
                    <p className="stat-label mb-0">
                      <b>Oxford International School</b>
                      <span className="opacity-50 mx-1">•</span>
                      {formattedDate}
                      <span className="opacity-50 mx-1">•</span>AY 2025-26
                    </p>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <Link
                    to={routes.addAdmission}
                    className="btn btn-primary btn-3d fw-medium d-inline-flex align-items-center"
                  >
                    <i className="ti ti-square-rounded-plus me-1" />
                    New Admission
                  </Link>
                  <Link
                    to={routes.collectFees}
                    className="btn btn-white btn-3d fw-medium d-inline-flex align-items-center"
                  >
                    <i className="ti ti-report-money me-1" />
                    Collect Fees
                  </Link>
                  <Link
                    to={routes.attendanceReport}
                    className="btn btn-white btn-3d fw-medium d-inline-flex align-items-center"
                  >
                    <i className="ti ti-file-analytics me-1" />
                    Report
                  </Link>
                </div>
              </div>

              {/* KPI strip */}
              <div className="col-xxl-7 col-lg-12">
                <div className="row g-3">
                  {welcomeKpis.map((kpi) => (
                    <div className="col-sm-6 col-md-3" key={kpi.id}>
                      <div className="stat-tile stat-tile-hover">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className={`avatar avatar-icon ${kpi.iconClass}`}>
                            <i className={kpi.icon} />
                          </span>
                          <span
                            className={`stat-delta stat-delta-sm stat-delta-${kpi.deltaDirection}`}
                          >
                            <i className={kpi.deltaIcon} />
                            {kpi.delta}
                          </span>
                        </div>
                        <h4 className="mb-0">{kpi.value}</h4>
                        <span className="stat-label stat-label-sm">{kpi.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
