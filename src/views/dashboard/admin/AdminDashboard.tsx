import { useCallback, useState } from 'react';
import ActivityTimelineCard from './components/ActivityTimelineCard';
import AttendanceBreakdownCard from './components/AttendanceBreakdownCard';
import AttendanceHeatmapCard from './components/AttendanceHeatmapCard';
import BookAvailabilityCard from './components/BookAvailabilityCard';
import BooksIssuedCard from './components/BooksIssuedCard';
import ClassDistributionCard from './components/ClassDistributionCard';
import CommunicationTrendCard from './components/CommunicationTrendCard';
import DashboardHeader from './components/DashboardHeader';
import DeliverySuccessCard from './components/DeliverySuccessCard';
import EnrollmentTrendCard from './components/EnrollmentTrendCard';
import FleetUtilizationCard from './components/FleetUtilizationCard';
import FuelConsumptionCard from './components/FuelConsumptionCard';
import GenderDistributionCard from './components/GenderDistributionCard';
import LiveFleetMapCard from './components/LiveFleetMapCard';
import LiveRouteStatusCard from './components/LiveRouteStatusCard';
import MaintenanceTimelineCard from './components/MaintenanceTimelineCard';
import MostBorrowedBooksCard from './components/MostBorrowedBooksCard';
import ParentEngagementCard from './components/ParentEngagementCard';
import ParentMessagesCard from './components/ParentMessagesCard';
import PopularCategoriesCard from './components/PopularCategoriesCard';
import RiskMatrixCard from './components/RiskMatrixCard';
import SpotlightCard from './components/SpotlightCard';
import WelcomeBanner from './components/WelcomeBanner';
import AddClassRoutineModal from './modals/AddClassRoutineModal';
import AddEventModal from './modals/AddEventModal';
import { spotlightCards } from './data/adminDashboard.data';

const AdminDashboard = () => {
  const [isClassRoutineOpen, setClassRoutineOpen] = useState(false);
  const [isEventOpen, setEventOpen] = useState(false);
  // Bumping this key remounts the charts, which is what the header's refresh
  // control does until a real data source is wired up.
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content widget-canvas" key={refreshKey}>
          <DashboardHeader onRefresh={handleRefresh} />

          <WelcomeBanner />

          {/* Student Intelligence */}
          <div className="row">
            <div className="col-xxl-4 col-lg-6 d-flex">
              <div className="d-flex flex-column flex-fill">
                {spotlightCards.map((card) => (
                  <SpotlightCard data={card} key={card.id} />
                ))}
              </div>
            </div>
            <div className="col-xxl-4 col-lg-6 d-flex">
              <ClassDistributionCard />
            </div>
            <div className="col-xxl-4 col-lg-12 d-flex">
              <RiskMatrixCard />
            </div>
          </div>

          {/* Attendance */}
          <div className="row">
            <div className="col-xxl-8 col-xl-7 d-flex">
              <AttendanceHeatmapCard />
            </div>
            <div className="col-xxl-4 col-xl-5 d-flex">
              <AttendanceBreakdownCard />
            </div>
          </div>

          {/* Parent Communication */}
          <div className="row">
            <div className="col-xxl-8 col-xl-7 d-flex">
              <CommunicationTrendCard />
            </div>
            <div className="col-xxl-4 col-xl-5 d-flex">
              <ParentEngagementCard />
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-4 col-xl-6 d-flex">
              <ActivityTimelineCard />
            </div>
            <div className="col-xxl-4 col-xl-6 d-flex">
              <ParentMessagesCard />
            </div>
            <div className="col-xxl-4 col-lg-12 d-flex">
              <DeliverySuccessCard />
            </div>
          </div>

          {/* Enrollment */}
          <div className="row">
            <div className="col-xxl-8 col-xl-12 d-flex">
              <EnrollmentTrendCard />
            </div>
            <div className="col-xxl-4 col-xl-12 d-flex">
              <GenderDistributionCard />
            </div>
          </div>

          {/* Library Analytics */}
          <div className="row">
            <div className="col-xxl-8 col-xl-12 d-flex">
              <BooksIssuedCard />
            </div>
            <div className="col-xxl-4 col-xl-12 d-flex">
              <BookAvailabilityCard />
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-7 col-xl-6 d-flex">
              <MostBorrowedBooksCard />
            </div>
            <div className="col-xxl-5 col-xl-6 d-flex">
              <PopularCategoriesCard />
            </div>
          </div>

          {/* Transport Dashboard */}
          <div className="row g-4">
            <div className="col-xxl-8 col-xl-7 d-flex">
              <FuelConsumptionCard />
            </div>
            <div className="col-xxl-4 col-xl-5 d-flex">
              <FleetUtilizationCard />
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-4 col-xl-6 d-flex">
              <LiveRouteStatusCard />
            </div>
            <div className="col-xxl-4 col-xl-6 d-flex">
              <MaintenanceTimelineCard />
            </div>
            <div className="col-xxl-4 col-lg-12 d-flex">
              <LiveFleetMapCard />
            </div>
          </div>
        </div>
      </div>

      {/*
        Both dialogs exist in the source HTML but have no trigger on this page.
        They are mounted here (closed) so the page owns them, and open through
        state as soon as a trigger is added.
      */}
      <AddClassRoutineModal
        open={isClassRoutineOpen}
        onClose={() => setClassRoutineOpen(false)}
      />
      <AddEventModal open={isEventOpen} onClose={() => setEventOpen(false)} />
    </>
  );
};

export default AdminDashboard;
