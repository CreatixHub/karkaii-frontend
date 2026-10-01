import { useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import IdentityColumn from './components/IdentityColumn';
import ProfileTabs from './components/ProfileTabs';
import StatCards from './components/StatCards';
import type { Student360Tab } from './data/student360.data';
import { identity, quickActions, statCards, tabs } from './data/student360.data';

const routes = all_routes;

const Student360 = () => {
  const [activeTab, setActiveTab] = useState<Student360Tab>('s360-overview');
  const { toasts, push, dismiss } = useToasts();

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Student 360°</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Students</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Student 360°
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <Link to={routes.studentGrid} className="btn btn-outline-light bg-white me-2 mb-2">
                <i className="ti ti-arrow-left me-1" />
                Back
              </Link>
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2"
                onClick={() => window.print()}
              >
                <i className="ti ti-printer me-1" />
                Print
              </button>
              <button
                type="button"
                className="btn btn-outline-danger me-2 mb-2"
                onClick={() => push('Student flagged as at-risk', 'danger')}
              >
                <i className="ti ti-flag me-1" />
                Flag At-Risk
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2"
                onClick={() => push('Progress report generated')}
              >
                <i className="ti ti-report me-1" />
                Progress Report
              </button>
            </div>
          </div>
          {/* /Page Header */}

          <div className="row">
            {/* Identity Column */}
            <IdentityColumn identity={identity} actions={quickActions} />
            {/* /Identity Column */}

            {/* Workspace */}
            <div className="col-xxl-9 col-xl-8">
              {/* 360 stat cards */}
              <StatCards cards={statCards} />

              <ProfileTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
            </div>
            {/* /Workspace */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="s360Toast" />
    </>
  );
};

export default Student360;
