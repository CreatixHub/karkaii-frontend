import { useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import ProfileSidebar from './components/ProfileSidebar';
import ProfileSkeleton from './components/ProfileSkeleton';
import ProfileTabs from './components/ProfileTabs';
import AcademicPane from './components/panes/AcademicPane';
import AchievementsPane from './components/panes/AchievementsPane';
import CertificatesPane from './components/panes/CertificatesPane';
import DonationsPane from './components/panes/DonationsPane';
import EventsPane from './components/panes/EventsPane';
import NotesPane from './components/panes/NotesPane';
import PersonalPane from './components/panes/PersonalPane';
import RolePane from './components/panes/RolePane';
import SkillsPane from './components/panes/SkillsPane';
import TimelinePane from './components/panes/TimelinePane';
import type { AlumniProfileModalId } from './data/alumniProfile.data';
import { employmentHistory, higherStudies, profile } from './data/alumniProfile.data';
import AlumniProfileModals from './modals/AlumniProfileModals';

const routes = all_routes;

const AlumniProfile = () => {
  const { loading } = useReveal(700);
  const { toasts, push, dismiss } = useToasts();

  const [activePane, setActivePane] = useState('al-personal');
  const [activeModal, setActiveModal] = useState<AlumniProfileModalId | null>(null);

  const openModal = (modal: AlumniProfileModalId) => setActiveModal(modal);

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
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Alumni Profile</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Students</li>
                  <li className="breadcrumb-item">
                    <Link to={routes.alumni}>Alumni</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {profile.name}
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <Link to={routes.alumni} className="btn btn-outline-light bg-white me-2 mb-2">
                <i className="ti ti-arrow-left me-1" />
                Back
              </Link>
              <Link to={routes.addAlumni} className="btn btn-outline-light bg-white me-2 mb-2">
                <i className="ti ti-edit-circle me-1" />
                Edit
              </Link>
              <button type="button" className="btn btn-outline-light bg-white me-2 mb-2" onClick={() => window.print()}>
                <i className="ti ti-printer me-1" />
                Print
              </button>
              <a
                href="#"
                className="btn btn-primary mb-2"
                onClick={(event) => {
                  event.preventDefault();
                  openModal('sendEmail');
                }}
              >
                <i className="ti ti-mail me-1" />
                Send Email
              </a>
            </div>
          </div>
          {/* /Page Header */}

          <div className="row">
            <ProfileSidebar />

            {/* Right Content */}
            <div className="col-xxl-9 col-xl-8">
              <div className="card">
                <div className="card-body pb-1">
                  <ProfileTabs active={activePane} onChange={setActivePane} />
                  <div className="tab-content">
                    {activePane === 'al-personal' ? <PersonalPane /> : null}
                    {activePane === 'al-academic' ? <AcademicPane /> : null}
                    {activePane === 'al-achievements' ? <AchievementsPane /> : null}
                    {activePane === 'al-employment' ? <RolePane title="Employment" items={employmentHistory} /> : null}
                    {activePane === 'al-higher' ? <RolePane title="Higher Studies" items={higherStudies} /> : null}
                    {activePane === 'al-skills' ? <SkillsPane /> : null}
                    {activePane === 'al-certificates' ? <CertificatesPane /> : null}
                    {activePane === 'al-events' ? <EventsPane /> : null}
                    {activePane === 'al-donations' ? <DonationsPane onAddDonation={() => openModal('addDonation')} /> : null}
                    {activePane === 'al-timeline' ? <TimelinePane /> : null}
                    {activePane === 'al-notes' ? <NotesPane onAddNote={() => push('Note added.')} /> : null}
                  </div>
                </div>
              </div>
            </div>
            {/* /Right Content */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      <AlumniProfileModals active={activeModal} onClose={() => setActiveModal(null)} onToast={push} />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="alumniProfileToasts" />
    </>
  );
};

export default AlumniProfile;
