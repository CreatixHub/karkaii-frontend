import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import { downloadTextFile } from '@utils/download.utils';
import TeacherDetailsHero from './components/TeacherDetailsHero';
import TeacherDetailsSidebar from './components/TeacherDetailsSidebar';
import TeacherDetailsSkeleton from './components/TeacherDetailsSkeleton';
import TeacherDetailsSummary from './components/TeacherDetailsSummary';
import TeacherDetailsTabRail from './components/TeacherDetailsTabRail';
import type { TeacherPaneId } from './components/TeacherDetailsTabRail';
import LeaveAttendancePane from './components/panes/LeaveAttendancePane';
import LibraryPane from './components/panes/LibraryPane';
import RoutinePane from './components/panes/RoutinePane';
import SalaryPane from './components/panes/SalaryPane';
import TeacherDetailsPane from './components/panes/TeacherDetailsPane';
import LoginDetailsModal from './modals/LoginDetailsModal';
import { teacherProfile } from './data/teacherProfile.data';
import type { DocumentCard, HeroMoreAction } from './data/teacherDetailsWorkspace.data';
import { PROFILE_TEXT } from './data/teacherDetailsWorkspace.data';
import type { PayslipRow } from './data/teacherDetailsPanes.data';

const routes = all_routes;

/** "Joining Letter.pdf" → "Joining-Letter-pdf", as the download helper wants it. */
const slug = (value: string) => value.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');

const TeacherDetails = () => {
  const [pane, setPane] = useState<TeacherPaneId>('teacher_details');
  const [loginOpen, setLoginOpen] = useState(false);

  // The template's script revealed the workspace after 700 ms; same timing here.
  const { loading } = useReveal(700);
  const { toasts, push, dismiss } = useToasts();

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

  /** `[data-td-print]` in `teacher-details.js`. */
  const handlePrint = useCallback(() => window.print(), []);

  const handleMoreAction = useCallback(
    (action: HeroMoreAction) => {
      if (action === 'idcard') {
        push(`ID card generated for ${teacherProfile.name}.`, 'success');
        return;
      }
      downloadTextFile(`${teacherProfile.name}-${teacherProfile.id}`, PROFILE_TEXT);
      push('Downloading profile…', 'success');
    },
    [push],
  );

  const previewDocument = useCallback(
    (document: DocumentCard) => push(`Opening ${document.name}…`, 'info'),
    [push],
  );

  const downloadDocument = useCallback(
    (document: DocumentCard) => {
      downloadTextFile(
        slug(document.name),
        `PRESKOOL ACADEMY\n${document.name}\nTeacher: ${teacherProfile.name} (${teacherProfile.id})\nUploaded: ${document.date}\nStatus: ${document.status}\n`,
      );
      push(`Downloading ${document.name}…`, 'success');
    },
    [push],
  );

  const downloadPayslip = useCallback(
    (payslip: PayslipRow) => {
      downloadTextFile(
        `Payslip-${slug(payslip.month)}-${teacherProfile.id}`,
        `PRESKOOL ACADEMY - PAYSLIP\n====================================\nTeacher : ${teacherProfile.name} (${teacherProfile.id})\nMonth   : ${payslip.month}\nNet Pay : ${payslip.netPay}\nPaid On : ${payslip.paidOn}\nStatus  : ${payslip.status}\n====================================\n`,
      );
      push(`Downloading ${payslip.month} payslip…`, 'success');
    },
    [push],
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Teacher Profile</h3>
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
          </div>

          {/* Skeleton Loader */}
          {loading ? <TeacherDetailsSkeleton /> : null}
          {/* /Skeleton Loader */}

          {loading ? null : (
            <div id="td_workspace">
              {/* Profile Hero */}
              <TeacherDetailsHero
                onSendMessage={() =>
                  push(`Message composer opened for ${teacherProfile.name}.`, 'info')
                }
                onLoginDetails={() => setLoginOpen(true)}
                onPrint={handlePrint}
                onMoreAction={handleMoreAction}
              />
              {/* /Profile Hero */}

              {/* Profile Summary */}
              <TeacherDetailsSummary />
              {/* /Profile Summary */}

              <div className="row">
                {/* Teacher Information */}
                <TeacherDetailsSidebar onCopy={copyText} />
                {/* /Teacher Information */}

                {/* Teacher Tabs & Content */}
                <div className="col-xxl-9 col-xl-8">
                  <div className="row">
                    <div className="col-md-12">
                      {/* List */}
                      <TeacherDetailsTabRail active={pane} onChange={setPane} />
                      {/* /List */}
                      <div className="tab-content">
                        <TeacherDetailsPane
                          active={pane === 'teacher_details'}
                          onPreviewDocument={previewDocument}
                          onDownloadDocument={downloadDocument}
                        />
                        <RoutinePane active={pane === 'routine'} />
                        <LeaveAttendancePane active={pane === 'leave_attendance'} />
                        <SalaryPane active={pane === 'salary'} onDownloadPayslip={downloadPayslip} />
                        <LibraryPane active={pane === 'library'} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Teacher Tabs & Content */}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Login Details */}
      <LoginDetailsModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      {/* /Login Details */}

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

export default TeacherDetails;
