import { useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import TeacherProfileSidebar from './components/TeacherProfileSidebar';
import TeacherProfileTabs from './components/TeacherProfileTabs';
import SalaryTable from './components/salary/SalaryTable';
import TeacherSalaryModals from './modals/TeacherSalaryModals';
import type { TeacherSalaryModalId } from './modals/TeacherSalaryModals';
import { salaryRows, salaryTiles, statCards } from './data/teacherSalary.data';

const routes = all_routes;

const TeacherSalary = () => {
  const [activeModal, setActiveModal] = useState<TeacherSalaryModalId | null>(null);
  const { toasts, push, dismiss } = useToasts();

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Page Header */}
            <div className="col-md-12">
              <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div className="my-auto mb-2">
                  <h3 className="page-title mb-1">Teacher Details</h3>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <Link to={routes.adminDashboard}>Dashboard</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to={routes.teacherGrid}>Teachers</Link>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Teacher Details
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="d-flex my-xl-auto right-content align-items-center  flex-wrap">
                  <button
                    type="button"
                    className="btn btn-light me-2 mb-2"
                    onClick={() => setActiveModal('loginDetail')}
                  >
                    <i className="ti ti-lock me-2" />
                    Login Details
                  </button>
                  <Link
                    to={routes.editTeacher}
                    className="btn btn-primary d-flex align-items-center mb-2"
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit Teacher
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-3">
            {statCards.map((card) => (
              <div className="col-xl-3 col-sm-6 d-flex" key={card.id}>
                <div className={`stats-card stats-card-teachers ${card.variant}`}>
                  <div className="stats-avatars">
                    {card.avatars.map((letter, index) => (
                      <span key={`${card.id}-${index}`}>{letter}</span>
                    ))}
                    <span className="stats-icon">
                      <i className={card.icon} />
                    </span>
                  </div>
                  <h3 className="stats-value mb-0">{card.value}</h3>
                  <p className="stats-label">{card.label}</p>
                  <div className="stats-bar">
                    <i style={{ width: card.barWidth }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* /Stats Cards */}

          <div className="row">
            {/* Teacher Information */}
            <TeacherProfileSidebar />
            {/* /Teacher Information */}

            <div className="col-xxl-9 col-xl-8">
              <div className="row">
                <div className="col-md-12">
                  {/* List */}
                  <TeacherProfileTabs current="salary" />
                  {/* /List */}

                  <div className="students-leaves-tab">
                    <div className="row">
                      {salaryTiles.map((tile) => (
                        <div className="col-md-6 col-xxl-3 d-flex" key={tile.id}>
                          <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
                            <div className="ms-2">
                              <p className="mb-1">{tile.label}</p>
                              <h5>{tile.value}</h5>
                            </div>
                            <span
                              className={`avatar avatar-lg ${tile.tint} rounded flex-shrink-0 ${tile.text}`}
                            >
                              <i className={`${tile.icon} fs-24`} />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="card">
                      <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                        <h4 className="mb-3">Salary</h4>
                      </div>
                      <div className="card-body p-0 py-3">
                        {/* Payroll List */}
                        <SalaryTable
                          rows={salaryRows}
                          onViewPayslip={(row) =>
                            push(`Payslip ${row.payrollId} for ${row.salaryFor} opened`)
                          }
                        />
                        {/* /Payroll List */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      <TeacherSalaryModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        onToast={push}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="tsToast" />
    </>
  );
};

export default TeacherSalary;
