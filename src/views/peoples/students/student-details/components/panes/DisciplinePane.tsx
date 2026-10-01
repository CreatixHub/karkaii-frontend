import { BlockHeading, Counter, ProfileEvent, ProfileRemark } from '../primitives';

const STATS = [
  { id: 'positive', accent: 'accent-success', icon: 'ti ti-thumb-up', count: 86, label: 'Positive Points' },
  { id: 'warnings', accent: 'accent-warning', icon: 'ti ti-alert-triangle', count: 1, label: 'Warnings' },
  { id: 'suspensions', accent: 'accent-danger', icon: 'ti ti-ban', count: 0, label: 'Suspensions' },
  { id: 'counselling', accent: 'accent-info', icon: 'ti ti-messages', count: 2, label: 'Counselling' },
];

const REPORTS = [
  { id: 'peer', tone: 'sub-green', icon: 'ti ti-thumb-up', title: 'Helped a peer in class', detail: '18 Nov 2024 · Positive behaviour', pill: 'ok', status: '+5 pts' },
  { id: 'late', tone: 'sub-amber', icon: 'ti ti-alert-triangle', title: 'Late submission of homework', detail: '02 Nov 2024 · Advisory issued', pill: 'warn', status: 'Warning' },
  { id: 'assembly', tone: 'sub-green', icon: 'ti ti-star', title: 'Excellent conduct in assembly', detail: '14 Oct 2024 · Recognised by staff', pill: 'ok', status: '+8 pts' },
];

const DisciplinePane = ({ revealed }: { revealed: boolean }) => (
  <div id="profile-pane-discipline" className="tab-pane-block active" data-pane="discipline" role="tabpanel">
    <div className="row g-3 mb-4 align-items-stretch">
      <div className="col-md-5">
        <div className="attendance-ringcard">
          <div
            className="ring-track attendance-ring accent-success"
            style={{ ['--val' as string]: revealed ? 94 : 0 }}
          >
            <div className="profile-ring-hole big">
              <span>
                <Counter value={94} revealed={revealed} />
              </span>
              <small>Conduct Score</small>
            </div>
          </div>
          <div className="attendance-ringcap">
            <i className="ti ti-mood-happy" />
            <b>Excellent</b> behaviour this term
          </div>
        </div>
      </div>

      <div className="col-md-7">
        <div className="fee-stats attendance-stats">
          {STATS.map((stat) => (
            <div className={`fee-stat ${stat.accent}`} key={stat.id}>
              <span className="avatar avatar-icon avatar-accent-soft">
                <i className={stat.icon} />
              </span>
              <div className="fee-stat-body">
                <div className="v">
                  <Counter value={stat.count} revealed={revealed} />
                </div>
                <div className="l">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <BlockHeading icon="ti ti-clipboard-list">Behaviour Reports</BlockHeading>
    <div className="mb-4">
      {REPORTS.map((report, index) => (
        <ProfileEvent
          key={report.id}
          tone={report.tone}
          className={index < REPORTS.length - 1 ? 'mb-2' : ''}
          icon={report.icon}
          title={report.title}
          detail={report.detail}
          end={<span className={`profile-pill ${report.pill} ms-auto`}>{report.status}</span>}
        />
      ))}
    </div>

    <BlockHeading icon="ti ti-messages">Counselling &amp; Teacher Feedback</BlockHeading>
    <ProfileRemark
      className="remark-teal"
      text="Well-behaved and respectful. Occasionally needs reminders on deadlines. Recommended a light time-management session."
      author={{
        photo: 'assets/img/teachers/teacher-02.jpg',
        name: 'Ms. Rita Owen',
        role: 'School Counsellor',
      }}
      end={
        <span className="profile-pill ok ms-auto">
          <i className="ti ti-calendar-check" />
          Last session 20 Nov
        </span>
      }
    />
  </div>
);

export default DisciplinePane;
