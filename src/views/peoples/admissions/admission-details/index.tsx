import { useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import DetailTabs from './components/DetailTabs';
import OverviewSidebar from './components/OverviewSidebar';
import ActivityPane from './components/panes/ActivityPane';
import DetailList from './components/panes/DetailList';
import DocumentsPane from './components/panes/DocumentsPane';
import FeesPane from './components/panes/FeesPane';
import GuardianPane from './components/panes/GuardianPane';
import InterviewPane from './components/panes/InterviewPane';
import NotesPane from './components/panes/NotesPane';
import TimelinePane from './components/panes/TimelinePane';
import ProfileHero from './components/ProfileHero';
import ProfileSkeleton from './components/ProfileSkeleton';
import SummaryCards from './components/SummaryCards';
import type { AdmissionDetailsModalId } from './data/admissionDetails.data';
import {
  academicDetails,
  emergencyDetails,
  hostelDetails,
  medicalDetails,
  medicalDoctorContact,
  personalAddress,
  personalDetails,
  previousSchoolDetails,
  profile,
  transportDetails,
} from './data/admissionDetails.data';
import AdmissionDetailsModals from './modals/AdmissionDetailsModals';

const routes = all_routes;

const AdmissionDetails = () => {
  const { loading } = useReveal(700);
  const { toasts, push, dismiss } = useToasts();

  const [activePane, setActivePane] = useState('personal');
  const [moreOpen, setMoreOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<AdmissionDetailsModalId | null>(null);

  const openModal = (modal: AdmissionDetailsModalId) => setActiveModal(modal);

  const handleMoreAction = (id: string) => {
    if (id === 'fees') return openModal('collectFees');
    if (id === 'documents') return openModal('uploadDocument');
    if (id === 'interview') return openModal('scheduleInterview');
    push(id === 'letter' ? 'Admission letter generated' : 'PDF downloaded');
  };

  const handleQuickAction = (id: string) => {
    if (id === 'interview') return openModal('scheduleInterview');
    if (id === 'fees') return openModal('collectFees');
    if (id === 'email') return openModal('sendEmail');
    if (id === 'waitlist') return openModal('waitlistApplication');
  };

  const confirmDelete = () => {
    setActiveModal(null);
    push('Application deleted.');
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div id="ad_workspace">
            {/* Breadcrumb */}
            <nav className="mb-3">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">Students</li>
                <li className="breadcrumb-item">
                  <Link to={routes.admissions}>Admissions</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {profile.admissionNo}
                </li>
              </ol>
            </nav>

            <ProfileHero
              moreOpen={moreOpen}
              onToggleMore={setMoreOpen}
              onMoreAction={handleMoreAction}
              onReject={() => openModal('rejectApplication')}
              onApprove={() => push('Application approved.')}
              onEmail={() => openModal('sendEmail')}
            />

            <SummaryCards />

            <div className="row">
              <OverviewSidebar onQuickAction={handleQuickAction} />

              {/* Right Content Column */}
              <div className="col-12 col-xxl-9 col-xl-8">
                <div className="row">
                  <div className="col-12">
                    <div className="card mb-0">
                      <DetailTabs active={activePane} onChange={setActivePane} />
                      <div className="card-body">
                        <div className="tab-content">
                          {activePane === 'personal' ? (
                            <DetailList
                              title="Personal Details"
                              fields={personalDetails}
                              wide={{ label: 'Address', value: personalAddress }}
                            />
                          ) : null}
                          {activePane === 'academic' ? (
                            <DetailList title="Academic Details" fields={academicDetails} />
                          ) : null}
                          {activePane === 'medical' ? (
                            <DetailList
                              title="Medical Details"
                              fields={medicalDetails}
                              wide={{ label: 'Doctor Contact', value: medicalDoctorContact }}
                            />
                          ) : null}
                          {activePane === 'guardian' ? <GuardianPane /> : null}
                          {activePane === 'emergency' ? (
                            <DetailList title="Emergency Contact" fields={emergencyDetails} />
                          ) : null}
                          {activePane === 'transport' ? (
                            <DetailList title="Transport" fields={transportDetails} />
                          ) : null}
                          {activePane === 'hostel' ? <DetailList title="Hostel" fields={hostelDetails} /> : null}
                          {activePane === 'previous' ? (
                            <DetailList title="Previous School" fields={previousSchoolDetails} />
                          ) : null}
                          {activePane === 'documents' ? (
                            <DocumentsPane onUpload={() => openModal('uploadDocument')} />
                          ) : null}
                          {activePane === 'interview' ? (
                            <InterviewPane
                              onSchedule={() => openModal('scheduleInterview')}
                              onSaveFeedback={() => push('Interview feedback saved.')}
                            />
                          ) : null}
                          {activePane === 'fees' ? <FeesPane onCollect={() => openModal('collectFees')} /> : null}
                          {activePane === 'timeline' ? <TimelinePane /> : null}
                          {activePane === 'notes' ? (
                            <NotesPane onAddNote={() => push('Note added.')} />
                          ) : null}
                          {activePane === 'activity' ? <ActivityPane /> : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Right Content Column */}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      <AdmissionDetailsModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="admDetailsToasts" />
    </>
  );
};

export default AdmissionDetails;
