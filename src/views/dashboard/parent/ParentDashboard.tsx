import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import ToastStack from '@components/ui/ToastStack';
import { useToasts } from '@hooks/useToasts';
import { downloadTextFile } from '@utils/download.utils';
import AchievementGallery from './components/AchievementGallery';
import AgendaCard from './components/AgendaCard';
import ChildSwitcher from './components/ChildSwitcher';
import ChildTimeline from './components/ChildTimeline';
import CommandBar from './components/CommandBar';
import CommunicationHub from './components/CommunicationHub';
import ExamHub from './components/ExamHub';
import FeeTimeline from './components/FeeTimeline';
import HomeworkBoard from './components/HomeworkBoard';
import LiveBus from './components/LiveBus';
import MyChildren from './components/MyChildren';
import ParentInsights from './components/ParentInsights';
import SmartNotifications from './components/SmartNotifications';
import SubjectVitals from './components/SubjectVitals';
import ParentModals from './modals/ParentModals';
import { usePortalReveal } from './usePortalReveal';
import type {
  ChildKey,
  ParentActionId,
  ParentModalId,
} from './data/parentDashboard.data';
import {
  ACTION_TOASTS,
  RECEIPT_BODY,
  REPORT_CARD_BODY,
  children,
} from './data/parentDashboard.data';

const routes = all_routes;

const ParentDashboard = () => {
  const [activeChild, setActiveChild] = useState<ChildKey>('Emma');
  const [activeModal, setActiveModal] = useState<ParentModalId | null>(null);
  const [notificationsRead, setNotificationsRead] = useState(false);

  const { loading, revealed } = usePortalReveal();
  const { toasts, push, dismiss } = useToasts();

  const child = useMemo(() => children[activeChild], [activeChild]);
  const firstName = child.name.split(' ')[0];

  const openModal = useCallback((modal: ParentModalId) => setActiveModal(modal), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const handleChildChange = useCallback(
    (next: ChildKey) => {
      setActiveChild(next);
      push(`Now viewing ${next}'s portal.`, 'success');
    },
    [push],
  );

  /** Mirrors the `data-px-action` router in parent-portal.js. */
  const handleAction = useCallback(
    (action: ParentActionId) => {
      const toast = ACTION_TOASTS[action];
      if (toast) push(toast.message, toast.variant);

      if (action === 'report') {
        downloadTextFile('Report-Card-Emma', REPORT_CARD_BODY);
      } else if (action === 'receipt') {
        downloadTextFile('Fee-Receipt-Emma', RECEIPT_BODY);
      } else if (action === 'mark_read') {
        setNotificationsRead(true);
      }
    },
    [push],
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-xxl-center align-items-start justify-content-between mb-3 flex-xxl-row flex-column gap-2">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Parent Dashboard</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Parent Dashboard
                  </li>
                </ol>
              </nav>
            </div>

            <ChildSwitcher active={activeChild} onChange={handleChildChange} />
          </div>

          <div className={`parent-portal${loading ? ' loading' : ''}`}>
            {loading ? (
              <div className="skeleton-loader">
                <div className="skeleton skeleton-cmd" />
                <div className="skeleton-kids">
                  <div className="skeleton skeleton-kid" />
                  <div className="skeleton skeleton-kid" />
                </div>
                <div className="skeleton-strip">
                  {Array.from({ length: 5 }, (_, index) => (
                    <div className="skeleton skeleton-cell" key={index} />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="live-flag-wrap">
              <CommandBar
                child={child}
                revealed={revealed}
                onOpenModal={openModal}
                onAction={handleAction}
              />

              <MyChildren revealed={revealed} onOpenModal={openModal} />

              <SubjectVitals childName={firstName} />

              {/* Timeline + Insights */}
              <div className="row g-3">
                <div className="col-12 col-xl-5">
                  <ChildTimeline childName={firstName} />
                </div>
                <div className="col-12 col-xl-7">
                  <ParentInsights revealed={revealed} />
                </div>
              </div>

              {/* Communication + Bus */}
              <div className="row g-3">
                <div className="col-12 col-xl-6">
                  <CommunicationHub onOpenModal={openModal} />
                </div>
                <div className="col-12 col-xl-6">
                  <LiveBus onAction={handleAction} />
                </div>
              </div>

              <HomeworkBoard childName={firstName} />

              {/* Finance + Exam */}
              <div className="row g-3">
                <div className="col-12 col-xl-7">
                  <FeeTimeline onOpenModal={openModal} onAction={handleAction} />
                </div>
                <div className="col-12 col-xl-5">
                  <ExamHub revealed={revealed} />
                </div>
              </div>

              <AchievementGallery />

              {/* Agenda + Notifications */}
              <div className="row g-3">
                <div className="col-12 col-xl-6">
                  <AgendaCard />
                </div>
                <div className="col-12 col-xl-6">
                  <SmartNotifications onAction={handleAction} allRead={notificationsRead} />
                </div>
              </div>
            </div>
          </div>

          <ParentModals
            active={activeModal}
            onClose={closeModal}
            onToast={push}
            child={child}
          />
        </div>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="pxToasts" />
    </>
  );
};

export default ParentDashboard;
