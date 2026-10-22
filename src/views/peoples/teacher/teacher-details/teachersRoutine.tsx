import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { useToasts } from '@hooks/useToasts';
import { all_routes } from '@/routes/all_routes';
import TeacherProfileSidebar from './components/TeacherProfileSidebar';
import TeacherProfileTabs from './components/TeacherProfileTabs';
import RoutineBreakCards from './components/routine/RoutineBreakCards';
import RoutineDayColumn from './components/routine/RoutineDayColumn';
import TeacherRoutineModals from './modals/TeacherRoutineModals';
import type { TeacherRoutineModalId } from './modals/TeacherRoutineModals';
import type { RoutinePeriod } from './data/teacherRoutine.data';
import { buildRoutineStats, routinePeriods, routineWeek } from './data/teacherRoutine.data';

const routes = all_routes;

const TeachersRoutine = () => {
  const [period, setPeriod] = useState<RoutinePeriod>('This Year');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<TeacherRoutineModalId | null>(null);

  const { toasts, push, dismiss } = useToasts();
  const location = useLocation();
  const navigate = useNavigate();

  const stats = useMemo(() => buildRoutineStats(routineWeek), []);

  // Close the period menu on an outside click, as Bootstrap's dropdown does.
  useEffect(() => {
    if (!periodOpen) return;
    const close = () => setPeriodOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [periodOpen]);

  // The template's orphaned Apply Leave dialog, reachable by fragment.
  useEffect(() => {
    if (location.hash === '#apply_leave') setActiveModal('applyLeave');
  }, [location.hash]);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    if (location.hash) navigate(location.pathname, { replace: true });
  }, [location.hash, location.pathname, navigate]);

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
            {stats.map((card) => (
              <div className="col-xl-3 col-sm-6 d-flex" key={card.id}>
                <div className={`stats-card stats-card-teachers ${card.variant}`}>
                  <div className="stats-avatars">
                    {card.initials.map((initial, index) => (
                      <span key={`${card.id}-${initial}-${index}`}>{initial}</span>
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
                  <TeacherProfileTabs current="routine" />
                  {/* /List */}

                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                      <h4 className="mb-3">Time Table</h4>
                      <div className="d-flex align-items-center flex-wrap">
                        <div className="dropdown mb-3">
                          <button
                            type="button"
                            className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
                            aria-expanded={periodOpen}
                            onMouseDown={(event) => event.stopPropagation()}
                            onClick={() => setPeriodOpen((open) => !open)}
                          >
                            <i className="ti ti-calendar-due me-2" />
                            {period}
                          </button>
                          <ul className={`dropdown-menu p-3${periodOpen ? ' show' : ''}`}>
                            {routinePeriods.map((option) => (
                              <li key={option}>
                                <button
                                  type="button"
                                  className={`dropdown-item rounded-1${
                                    option === period ? ' active' : ''
                                  }`}
                                  onClick={() => {
                                    setPeriod(option);
                                    setPeriodOpen(false);
                                    push(`Time table scoped to ${option.toLowerCase()}`);
                                  }}
                                >
                                  {option}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="d-flex flex-nowrap overflow-auto">
                        {routineWeek.map((day) => (
                          <RoutineDayColumn day={day} key={day.id} />
                        ))}
                      </div>
                    </div>
                    <RoutineBreakCards />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Apply Leave + Login Details */}
      <TeacherRoutineModals active={activeModal} onClose={closeModal} onToast={push} />
      {/* /Apply Leave + Login Details */}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="trToast" />
    </>
  );
};

export default TeachersRoutine;
