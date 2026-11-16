import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import { acceptAdmission } from '@services/admissions/admissions.api';
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
import { applyAdmission, dobPasswordText, loadAdmissionDetail } from './data/admissionDetails.live';
import AdmissionDetailsModals from './modals/AdmissionDetailsModals';

const routes = all_routes;

const AdmissionDetails = () => {
  const [params] = useSearchParams();
  const admissionId = params.get('id') ?? '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('');
  const [dobPassword, setDobPassword] = useState('');
  const [accepting, setAccepting] = useState(false);
  const [credentials, setCredentials] = useState<{ username: string } | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const [activePane, setActivePane] = useState('personal');
  const [moreOpen, setMoreOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<AdmissionDetailsModalId | null>(null);

  /* Loads the real application into the page's data objects. `quiet` skips the skeleton. */
  const load = useCallback(
    async (quiet = false) => {
      if (!admissionId) {
        setError('No application selected. Open one from the Admissions list.');
        setLoading(false);
        return;
      }
      if (!quiet) setLoading(true);
      try {
        const a = await loadAdmissionDetail(admissionId);
        applyAdmission(a);
        setApiStatus(a.status);
        setDobPassword(dobPasswordText(a.dob));
        setError('');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load this application');
      } finally {
        setLoading(false);
      }
    },
    [admissionId],
  );

  useEffect(() => {
    void load();
  }, [load]);

  /* Approve = accept: creates the student record and the student's login. */
  const accept = async () => {
    if (['accepted', 'rejected', 'withdrawn'].includes(apiStatus)) {
      push(apiStatus === 'accepted' ? 'This application is already approved.' : 'This application is closed.');
      return;
    }
    setAccepting(true);
    try {
      const result = await acceptAdmission(admissionId);
      if (result.login) setCredentials({ username: result.login.username });
      push('Application accepted. Student record created.');
      await load(true);
    } catch (e) {
      push(e instanceof Error ? e.message : 'Could not accept the application');
    } finally {
      setAccepting(false);
    }
  };

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

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="alert alert-danger">{error}</div>
          <Link to={routes.admissions} className="btn btn-primary">
            Back to Admissions
          </Link>
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
              onApprove={() => void (accepting ? undefined : accept())}
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

      <Modal
        open={credentials !== null}
        onClose={() => setCredentials(null)}
        title="Student login created"
        footer={
          <button type="button" className="btn btn-primary" onClick={() => setCredentials(null)}>
            Done
          </button>
        }
      >
        <p className="mb-3">
          Share these sign-in details with the family. The student should change the password after the first sign in.
        </p>
        <div className="border rounded p-3">
          <div className="mb-2">
            Username: <strong>{credentials?.username}</strong>
          </div>
          <div>
            Password: <strong>{dobPassword}</strong> <span className="text-muted">(date of birth)</span>
          </div>
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="admDetailsToasts" />
    </>
  );
};

export default AdmissionDetails;