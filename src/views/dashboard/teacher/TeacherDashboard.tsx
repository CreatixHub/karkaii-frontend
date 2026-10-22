import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import ToastStack from '@components/ui/ToastStack';
import { useToasts } from '@hooks/useToasts';
import AchievementsCard from './components/AchievementsCard';
import ActivityTimelineCard from './components/ActivityTimelineCard';
import AiInsightsPanel from './components/AiInsightsPanel';
import AssignmentsCard from './components/AssignmentsCard';
import AttendanceCenterCard from './components/AttendanceCenterCard';
import CalendarCard from './components/CalendarCard';
import ClassPerformance from './components/ClassPerformance';
import ExamGradingCard from './components/ExamGradingCard';
import MyClasses from './components/MyClasses';
import NotificationsCard from './components/NotificationsCard';
import ParentCommunicationCard from './components/ParentCommunicationCard';
import StudentInsightsCard from './components/StudentInsightsCard';
import TeacherHero from './components/TeacherHero';
import TeacherKpiGrid from './components/TeacherKpiGrid';
import TodaysTimetable from './components/TodaysTimetable';
import TeacherModals from './modals/TeacherModals';
import type { TeacherModalId } from './data/teacherDashboard.data';

const routes = all_routes;

const TeacherDashboard = () => {
  const [activeModal, setActiveModal] = useState<TeacherModalId | null>(null);
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((modal: TeacherModalId) => setActiveModal(modal), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Teacher Dashboard</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Teacher Dashboard
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="content-section">
            <div className="live-indicator">
              <TeacherHero onOpenModal={openModal} />
              <TeacherKpiGrid onOpenModal={openModal} />

              {/* Timetable + AI */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-xl-8">
                  <TodaysTimetable onOpenModal={openModal} />
                </div>
                <div className="col-12 col-xl-4">
                  <AiInsightsPanel />
                </div>
              </div>

              <ClassPerformance onOpenModal={openModal} />
              <MyClasses onOpenModal={openModal} />

              {/* Assignments + Exam/Grading */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-xl-8">
                  <AssignmentsCard onOpenModal={openModal} />
                </div>
                <div className="col-12 col-xl-4">
                  <ExamGradingCard />
                </div>
              </div>

              {/* Attendance + Parent communication */}
              <div className="row g-3 mb-3">
                {/* The template uses xxl here and xl on its sibling; kept as-is. */}
                <div className="col-12 col-xxl-6">
                  <AttendanceCenterCard onOpenModal={openModal} />
                </div>
                <div className="col-12 col-xl-6">
                  <ParentCommunicationCard onOpenModal={openModal} />
                </div>
              </div>

              {/* Student insights + achievements */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-xxl-8">
                  <StudentInsightsCard onOpenModal={openModal} />
                </div>
                <div className="col-12 col-xxl-4">
                  <AchievementsCard />
                </div>
              </div>

              {/* Calendar + activity + notifications */}
              <div className="row g-3 mb-2">
                <div className="col-xxl-4 col-xl-6">
                  <CalendarCard onOpenModal={openModal} />
                </div>
                <div className="col-xxl-4 col-xl-6">
                  <ActivityTimelineCard />
                </div>
                <div className="col-xxl-4 col-xl-12">
                  <NotificationsCard onOpenModal={openModal} />
                </div>
              </div>
            </div>

            <TeacherModals
              active={activeModal}
              onClose={closeModal}
              onOpen={openModal}
              onToast={push}
            />
          </div>
        </div>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="tdToasts" />
    </>
  );
};

export default TeacherDashboard;
