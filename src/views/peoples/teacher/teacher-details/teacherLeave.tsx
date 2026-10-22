import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import TeacherProfileSidebar from './components/TeacherProfileSidebar';
import TeacherProfileTabs from './components/TeacherProfileTabs';
import AttendancePane from './components/leaves/AttendancePane';
import LeavesPane from './components/leaves/LeavesPane';
import TeacherLeaveModals from './modals/TeacherLeaveModals';
import type { AppliedLeave, TeacherLeaveModalId } from './modals/TeacherLeaveModals';
import type { LeaveBalance, LeaveRow } from './data/teacherLeaves.data';
import { leaveBalances, leaveRows, statCards } from './data/teacherLeaves.data';

const routes = all_routes;

const TeacherLeave = () => {
  const [tab, setTab] = useState<'leave' | 'attendance'>('leave');
  const [rows, setRows] = useState<LeaveRow[]>(leaveRows);
  const [balances, setBalances] = useState<LeaveBalance[]>(leaveBalances);
  const [activeModal, setActiveModal] = useState<TeacherLeaveModalId | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const applyLeave = useCallback((leave: AppliedLeave) => {
    setRows((current) => [
      ...current,
      {
        id: `lv-${current.length + 1}-${Date.now()}`,
        type: leave.type,
        dateRange: `${leave.from} - ${leave.to}`,
        days: leave.days,
        appliedOn: `${leave.appliedOn} `,
        status: 'Pending',
      },
    ]);

    // The dialog's leave types map onto the balance cards by name; "Special
    // Leave" has no card in the template, so nothing is charged for it.
    setBalances((current) =>
      current.map((balance) =>
        balance.type === leave.type
          ? {
              ...balance,
              used: Math.min(balance.allocated, balance.used + Number(leave.days || 0)),
            }
          : balance,
      ),
    );
  }, []);

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
                  <TeacherProfileTabs current="leaves" />
                  {/* /List */}

                  {/* Leave Nav*/}
                  <div className="card">
                    <div className="card-body pb-1">
                      <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded-fill">
                        <li className="me-3 mb-3">
                          <Link
                            to="#leave"
                            className={`nav-link${tab === 'leave' ? ' active' : ''} rounded fs-12 fw-semibold`}
                            onClick={(event) => {
                              event.preventDefault();
                              setTab('leave');
                            }}
                          >
                            Leaves
                          </Link>
                        </li>
                        <li className="mb-3">
                          <Link
                            to="#attendance"
                            className={`nav-link${tab === 'attendance' ? ' active' : ''} rounded fs-12 fw-semibold`}
                            onClick={(event) => {
                              event.preventDefault();
                              setTab('attendance');
                            }}
                          >
                            Attendance
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* /Leave Nav*/}

                  <div className="tab-content">
                    {/* Leave */}
                    <div
                      className={`tab-pane fade${tab === 'leave' ? ' show active' : ''}`}
                      id="leave"
                    >
                      <LeavesPane
                        balances={balances}
                        rows={rows}
                        onApplyLeave={() => setActiveModal('applyLeave')}
                      />
                    </div>
                    {/* /Leave */}

                    {/* Attendance */}
                    <div
                      className={`tab-pane fade${tab === 'attendance' ? ' show active' : ''}`}
                      id="attendance"
                    >
                      <AttendancePane onToast={push} />
                    </div>
                    {/* /Attendance */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      <TeacherLeaveModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onApplyLeave={applyLeave}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="tlToast" />
    </>
  );
};

export default TeacherLeave;
