import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import AcademicPerformance from './components/AcademicPerformance';
import AchievementsCard from './components/AchievementsCard';
import ActivityTimelineCard from './components/ActivityTimelineCard';
import AiLearningInsights from './components/AiLearningInsights';
import AssignmentsCard from './components/AssignmentsCard';
import AttendanceCenterCard from './components/AttendanceCenterCard';
import CalendarCard from './components/CalendarCard';
import CommunicationCard from './components/CommunicationCard';
import ExamCenterCard from './components/ExamCenterCard';
import FeeSummaryCard from './components/FeeSummaryCard';
import GoalsCard from './components/GoalsCard';
import LearningProgressCard from './components/LearningProgressCard';
import LibraryCard from './components/LibraryCard';
import MyTeachersCard from './components/MyTeachersCard';
import NotificationsCard from './components/NotificationsCard';
import StudentHero from './components/StudentHero';
import StudentKpiGrid from './components/StudentKpiGrid';
import TodaysSchedule from './components/TodaysSchedule';
import TransportCard from './components/TransportCard';
import StudentModals from './modals/StudentModals';
import type { StudentModalId } from './data/studentDashboard.data';

const routes = all_routes;

const StudentDashboard = () => {
  const [activeModal, setActiveModal] = useState<StudentModalId | null>(null);

  const openModal = useCallback((modal: StudentModalId) => setActiveModal(modal), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  return (
    <div className="page-wrapper">
      <div className="content content-two">
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Student Dashboard</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Student Dashboard
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="content-section">
          <div className="live-indicator">
            <StudentHero onOpenModal={openModal} />
            <StudentKpiGrid onOpenModal={openModal} />

            {/* Schedule + AI */}
            <div className="row g-3 mb-3">
              <div className="col-xxl-8 col-xl-6">
                <TodaysSchedule onOpenModal={openModal} />
              </div>
              <div className="col-xxl-4 col-xl-6">
                <AiLearningInsights onOpenModal={openModal} />
              </div>
            </div>

            <AcademicPerformance onOpenModal={openModal} />

            {/* Assignments + Exam Center */}
            <div className="row g-3 mb-3">
              <div className="col-xxl-8 col-xl-6">
                <AssignmentsCard onOpenModal={openModal} />
              </div>
              <div className="col-xxl-4 col-xl-6">
                <ExamCenterCard onOpenModal={openModal} />
              </div>
            </div>

            {/* Attendance + Fees */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-xl-6">
                <AttendanceCenterCard />
              </div>
              <div className="col-12 col-xl-6">
                <FeeSummaryCard onOpenModal={openModal} />
              </div>
            </div>

            {/* Learning progress + Goals */}
            <div className="row g-3 mb-3">
              <div className="col-xxl-6 col-xl-5">
                <LearningProgressCard />
              </div>
              <div className="col-xxl-6 col-xl-7">
                <GoalsCard onOpenModal={openModal} />
              </div>
            </div>

            {/* Achievements + Teachers */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-xl-8">
                <AchievementsCard />
              </div>
              <div className="col-12 col-xl-4">
                <MyTeachersCard onOpenModal={openModal} />
              </div>
            </div>

            {/* Communication + Library + Transport */}
            <div className="row g-3 mb-3">
              <div className="col-xxl-4 col-xl-6">
                <CommunicationCard onOpenModal={openModal} />
              </div>
              <div className="col-xxl-4 col-xl-6">
                <LibraryCard onOpenModal={openModal} />
              </div>
              <div className="col-xxl-4 col-xl-12">
                <TransportCard onOpenModal={openModal} />
              </div>
            </div>

            {/* Calendar + Activity + Notifications */}
            <div className="row g-3">
              <div className="col-xxl-4 col-xl-6">
                <CalendarCard />
              </div>
              <div className="col-xxl-4 col-xl-6">
                <ActivityTimelineCard />
              </div>
              <div className="col-xxl-4 col-xl-12">
                <NotificationsCard />
              </div>
            </div>
          </div>

          <StudentModals active={activeModal} onClose={closeModal} onOpen={openModal} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
