import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import { downloadTextFile } from '@utils/download.utils';
import TeacherDetailsHero from './components/TeacherDetailsHero';
import TeacherDetailsSidebar from './components/TeacherDetailsSidebar';
import TeacherDetailsSkeleton from './components/TeacherDetailsSkeleton';
import TeacherDetailsSummary from './components/TeacherDetailsSummary';
import TeacherDetailsTabRail from './components/TeacherDetailsTabRail';
import type { TeacherPaneId } from './components/TeacherDetailsTabRail';
import TeacherDetailsPane from './components/panes/TeacherDetailsPane';
import LoginDetailsModal from './modals/LoginDetailsModal';
import type { HeroMoreAction } from './data/teacherDetailsWorkspace.data';
import { useTeacherProfile } from './hooks/useTeacherProfile';
import type { LiveProfile } from './data/teacherProfileLive';

const routes = all_routes;

/** A tab whose module is not connected yet: honest message, no sample numbers. */
const InfoPane = ({
  active,
  id,
  title,
  children,
}: {
  active: boolean;
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div className={`tab-pane fade${active ? ' show active' : ''}`} id={id}>
    <div className="card">
      <div className="card-body">
        <h5 className="mb-2">{title}</h5>
        {children}
      </div>
    </div>
  </div>
);

const profileText = (p: LiveProfile) =>
  [
    'KARKAII ACADEMY - TEACHER PROFILE',
    '====================================',
    `Name          : ${p.name}`,
    `Employee ID   : ${p.employeeNo}`,
    `Status        : ${p.statusLabel}`,
    `Email         : ${p.email}`,
    `Phone         : ${p.phone}`,
    `Date of Birth : ${p.dob}`,
    `Qualification : ${p.qualification}`,
    `Experience    : ${p.experience}`,
    `Joined        : ${p.joinedOn}`,
    `Classes       : ${p.sectionsText}`,
    `Subjects      : ${p.subjectsText}`,
    '====================================',
    '',
  ].join('\n');

const TeacherDetails = () => {
  const [pane, setPane] = useState<TeacherPaneId>('teacher_details');
  const [loginOpen, setLoginOpen] = useState(false);

  const { status, error, profile } = useTeacherProfile();
  const { toasts, push, dismiss } = useToasts();

  const handlePrint = useCallback(() => window.print(), []);

  const handleMoreAction = useCallback(
    (action: HeroMoreAction) => {
      if (!profile) return;
      if (action === 'idcard') {
        push(`ID card generated for ${profile.name}.`, 'success');
        return;
      }
      downloadTextFile(`${profile.name}-${profile.employeeNo}`, profileText(profile));
      push('Downloading profile…', 'success');
    },
    [profile, push],
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

          {status === 'loading' ? <TeacherDetailsSkeleton /> : null}

          {status === 'missing' ? (
            <div className="alert alert-warning">
              No teacher selected. Open a teacher from the <Link to={routes.teacherGrid}>teachers list</Link>.
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="alert alert-danger">
              {error || 'Could not load this teacher.'} <Link to={routes.teacherGrid}>Back to teachers</Link>
            </div>
          ) : null}

          {status === 'ready' && profile ? (
            <div id="td_workspace">
              <TeacherDetailsHero
                profile={profile}
                onSendMessage={() => push(`Message composer opened for ${profile.name}.`, 'info')}
                onLoginDetails={() => setLoginOpen(true)}
                onPrint={handlePrint}
                onMoreAction={handleMoreAction}
              />

              <TeacherDetailsSummary profile={profile} />

              <div className="row">
                <TeacherDetailsSidebar profile={profile} />

                <div className="col-xxl-9 col-xl-8">
                  <div className="row">
                    <div className="col-md-12">
                      <TeacherDetailsTabRail active={pane} onChange={setPane} />
                      <div className="tab-content">
                        <TeacherDetailsPane active={pane === 'teacher_details'} profile={profile} />

                        <InfoPane active={pane === 'routine'} id="routine" title="Weekly routine">
                          <p className="text-muted">The full weekly timetable of this teacher is on its own page.</p>
                          <Link to={`${routes.teachersRoutine}?id=${profile.id}`} className="btn btn-primary btn-sm">
                            <i className="ti ti-table me-1" />
                            Open timetable
                          </Link>
                        </InfoPane>

                        <InfoPane active={pane === 'leave_attendance'} id="leave_attendance" title="Leave & attendance">
                          <p className="text-muted mb-0">
                            Nothing to show yet. Leave and attendance records will appear here once that module is
                            connected.
                          </p>
                        </InfoPane>

                        <InfoPane active={pane === 'salary'} id="salary" title="Salary">
                          <p className="text-muted mb-0">
                            Nothing to show yet. Salary and payslips will appear here once payroll is connected.
                          </p>
                        </InfoPane>

                        <InfoPane active={pane === 'library'} id="library" title="Library">
                          <p className="text-muted mb-0">
                            Nothing to show yet. Issued books will appear here once the library is connected.
                          </p>
                        </InfoPane>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
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