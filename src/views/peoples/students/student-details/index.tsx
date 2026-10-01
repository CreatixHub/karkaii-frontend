import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import { downloadTextFile } from '@utils/download.utils';
import ExecutiveOverview from './components/ExecutiveOverview';
import ProfileHero from './components/ProfileHero';
import ProfileSidebar from './components/ProfileSidebar';
import ProfileTabs from './components/ProfileTabs';
import type { ProfilePaneId } from './components/ProfileTabs';
import OverviewPane from './components/panes/OverviewPane';
import AttendancePane from './components/panes/AttendancePane';
import AcademicsPane from './components/panes/AcademicsPane';
import ExamsPane from './components/panes/ExamsPane';
import FeesPane from './components/panes/FeesPane';
import type { PaymentTarget } from './components/panes/FeesPane';
import TimetablePane from './components/panes/TimetablePane';
import HealthPane from './components/panes/HealthPane';
import LibraryPane from './components/panes/LibraryPane';
import DocumentsPane from './components/panes/DocumentsPane';
import TimelinePane from './components/panes/TimelinePane';
import AchievementsPane from './components/panes/AchievementsPane';
import DisciplinePane from './components/panes/DisciplinePane';
import CommunicationPane from './components/panes/CommunicationPane';
import NotesPane from './components/panes/NotesPane';
import AuditPane from './components/panes/AuditPane';
import StudentProfileModals from './modals/StudentProfileModals';
import TrackBusModal from './modals/TrackBusModal';
import LoginDetailsModal from './modals/LoginDetailsModal';
import ProfileSkeleton from './components/ProfileSkeleton';
import type { ConfirmOptions, ProfileAction, ProfileModalId } from './data/studentProfileActions';
import {
  ACTION_TOASTS,
  CONFIRMATIONS,
  WHATSAPP_URL,
} from './data/studentProfileActions';
import {
  CERTIFICATE_TEXT,
  PROFILE_TEXT,
  REPORT_CARD_TEXT,
  recordLinks,
} from './data/studentProfile.data';

const routes = all_routes;

/** Receipt body generated after a successful payment, as the script built it. */
const receiptText = (label: string, amount: number, txn: string) =>
  `PRESKOOL ACADEMY - PAYMENT RECEIPT
====================================
Receipt No : ${txn}
Student    : Janet Daniel (AD1256589) - Class III-A
Paid For   : ${label}
Amount     : $${amount.toLocaleString()}
Method     : Card ****4521
Status     : PAID - Confirmed
Payer      : Robert Daniel (Parent)
====================================
System-generated receipt.
`;

const StudentDetails = () => {
  const [pane, setPane] = useState<ProfilePaneId>('overview');
  const [activeModal, setActiveModal] = useState<ProfileModalId | null>(null);
  const [confirm, setConfirm] = useState<ConfirmOptions | null>(null);
  const [payment, setPayment] = useState<PaymentTarget>({
    label: 'Term II Tuition',
    amount: 2000,
  });
  const [moreOpen, setMoreOpen] = useState(false);

  const { loading, revealed } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((modal: ProfileModalId) => setActiveModal(modal), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  /** `download_doc` in the script: slugify the row's name and write a stub file. */
  const downloadDoc = useCallback(
    (name: string) => {
      downloadTextFile(
        `${name.replace(/[^a-z0-9]+/gi, '-')}.txt`,
        `PRESKOOL ACADEMY\n${name}\nStudent: Janet Daniel (AD1256589)\n`,
      );
      push(`Downloading ${name}…`, 'success');
    },
    [push],
  );

  const copyText = useCallback(
    (value: string) => {
      if (!value) return;
      navigator.clipboard?.writeText(value).then(
        () => push('Copied to clipboard.', 'success'),
        () => push('Copied to clipboard.', 'success'),
      );
    },
    [push],
  );

  /** Mirrors the `data-sp-action` switch in student-profile.js. */
  const handleAction = useCallback(
    (action: ProfileAction) => {
      const toast = ACTION_TOASTS[action];
      if (toast) push(toast.message, toast.variant);

      switch (action) {
        case 'print':
          window.print();
          return;
        case 'message':
        case 'email':
        case 'call':
        case 'meeting':
        case 'homework':
        case 'idcard':
          openModal(action);
          return;
        case 'track_bus':
          openModal('track');
          return;
        case 'whatsapp':
          window.open(WHATSAPP_URL, '_blank', 'noopener');
          return;
        case 'download':
          downloadTextFile('Janet-Daniel-AD1256589.txt', PROFILE_TEXT);
          return;
        case 'certificate':
          downloadTextFile('Certificate-Janet-Daniel.txt', CERTIFICATE_TEXT);
          return;
        case 'download_report':
          downloadTextFile('Report-Card-Janet-Daniel-TermII.txt', REPORT_CARD_TEXT);
          return;
        case 'transfer':
        case 'suspend':
        case 'archive':
        case 'reset_password':
          setConfirm(CONFIRMATIONS[action]);
          openModal('confirm');
          return;
        default:
          // `upload` only toasts, which already happened above.
          return;
      }
    },
    [openModal, push],
  );

  const confirmAction = useCallback(() => {
    if (confirm) push(confirm.toast.message, confirm.toast.variant);
    setConfirm(null);
    closeModal();
  }, [confirm, closeModal, push]);

  const startPayment = useCallback(
    (target: PaymentTarget) => {
      setPayment(target);
      openModal('pay');
    },
    [openModal],
  );

  /** The script generated a receipt file 1.35 s after a successful payment. */
  const onPaid = useCallback((target: PaymentTarget) => {
    const txn = `TXN${target.label.length * 7919 + String(target.amount).length * 1049 + 100237}`;
    downloadTextFile(`Receipt-${txn}.txt`, receiptText(target.label, target.amount, txn));
  }, []);

  const renderPane = () => {
    switch (pane) {
      case 'overview':
        return <OverviewPane />;
      case 'attendance':
        return <AttendancePane revealed={revealed} />;
      case 'academics':
        return <AcademicsPane revealed={revealed} />;
      case 'exams':
        return (
          <ExamsPane revealed={revealed} onAction={handleAction} onDownloadDoc={downloadDoc} />
        );
      case 'fees':
        return (
          <FeesPane
            revealed={revealed}
            onPay={startPayment}
            onOpenModal={openModal}
            onDownloadDoc={downloadDoc}
          />
        );
      case 'timetable':
        return <TimetablePane />;
      case 'health':
        return <HealthPane onAction={handleAction} onDownloadDoc={downloadDoc} />;
      case 'library':
        return <LibraryPane revealed={revealed} onRenew={downloadDoc} />;
      case 'documents':
        return <DocumentsPane onAction={handleAction} onDownloadDoc={downloadDoc} />;
      case 'timeline':
        return <TimelinePane />;
      case 'achievements':
        return <AchievementsPane revealed={revealed} />;
      case 'discipline':
        return <DisciplinePane revealed={revealed} />;
      case 'communication':
        return <CommunicationPane revealed={revealed} onAction={handleAction} />;
      case 'notes':
        return <NotesPane onToast={push} />;
      case 'audit':
        return <AuditPane revealed={revealed} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div className="my-auto mb-2 d-flex align-items-center gap-2">
              <Link to={routes.studentGrid} className="profile-back" aria-label="Back to students">
                <i className="ti ti-arrow-left" />
              </Link>
              <div>
                <h3 className="page-title mb-1">Student Profile</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to={routes.studentGrid}>Student</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Student 360° Profile
                    </li>
                  </ol>
                </nav>
              </div>
            </div>

            <div className="student-profile">
              <div className="profile-actions my-auto">
                <Link to={routes.editStudent} className="profile-button profile-button-primary">
                  <i className="ti ti-edit" />
                  Edit Student
                </Link>
                <button
                  type="button"
                  className="profile-button"
                  onClick={() => handleAction('print')}
                >
                  <i className="ti ti-printer" />
                  Print
                </button>
                <button
                  type="button"
                  className="profile-button"
                  onClick={() => handleAction('download')}
                >
                  <i className="ti ti-download" />
                  Download
                </button>
                <button
                  type="button"
                  className="profile-button"
                  onClick={() => handleAction('idcard')}
                >
                  <i className="ti ti-id" />
                  ID Card
                </button>

                <div className="dropdown">
                  <button
                    type="button"
                    className="profile-button profile-icon-button"
                    aria-label="More actions"
                    aria-expanded={moreOpen}
                    onBlur={() => window.setTimeout(() => setMoreOpen(false), 150)}
                    onClick={() => setMoreOpen((open) => !open)}
                  >
                    <i className="ti ti-dots-vertical" />
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-end p-2${moreOpen ? ' show' : ''}`}>
                    <li>
                      <h4 className="dropdown-header dropdown-head fs-15 fw-medium">
                        Student Records
                      </h4>
                    </li>
                    {recordLinks.map((link) => (
                      <li key={link.id}>
                        <Link
                          className="dropdown-item rounded-1"
                          to={routes[link.route as keyof typeof routes]}
                          onClick={() => setMoreOpen(false)}
                        >
                          <i className={`${link.icon} me-2`} />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <h5 className="dropdown-header dropdown-head fs-15">Actions</h5>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item rounded-1"
                        to={routes.studentPromotion}
                        onClick={() => setMoreOpen(false)}
                      >
                        <i className="ti ti-arrow-ramp-right-2 me-2" />
                        Promote Student
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item rounded-1"
                        onClick={() => {
                          setMoreOpen(false);
                          handleAction('transfer');
                        }}
                      >
                        <i className="ti ti-transfer me-2" />
                        Transfer Student
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item rounded-1"
                        onClick={() => {
                          setMoreOpen(false);
                          openModal('login');
                        }}
                      >
                        <i className="ti ti-lock me-2" />
                        Login Details
                      </button>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item rounded-1"
                        onClick={() => {
                          setMoreOpen(false);
                          handleAction('suspend');
                        }}
                      >
                        <i className="ti ti-ban me-2" />
                        Suspend Student
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item rounded-1"
                        onClick={() => {
                          setMoreOpen(false);
                          handleAction('archive');
                        }}
                      >
                        <i className="ti ti-archive me-2" />
                        Archive Student
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          <div className={`student-profile${loading ? '' : ' loaded'}`} id="studentProfile">
            {loading ? <ProfileSkeleton /> : null}

            {!loading ? (
              <div className="profile-live">
                <ProfileHero revealed={revealed} onAction={handleAction} />
                <ExecutiveOverview revealed={revealed} />

                <div className="row g-3">
                  <ProfileSidebar onAction={handleAction} />

                  <div className="col-xxl-8 col-xl-7">
                    <div className="card sticky-item">
                      <div className="card-header">
                        <ProfileTabs active={pane} onChange={setPane} />
                      </div>
                      <div className="card-body">{renderPane()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      <StudentProfileModals
        active={activeModal}
        onClose={closeModal}
        onToast={push}
        onAction={handleAction}
        confirm={confirm}
        onConfirm={confirmAction}
        payment={payment}
        onPaid={onPaid}
      />

      <TrackBusModal
        open={activeModal === 'track'}
        onClose={closeModal}
        onAction={handleAction}
      />

      <LoginDetailsModal
        open={activeModal === 'login'}
        onClose={closeModal}
        onCopy={copyText}
        onAction={handleAction}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="sp_toasts" />
    </>
  );
};

export default StudentDetails;
