import { BlockHeading, Counter, ProfileEvent } from '../primitives';

const STATS = [
  { id: 'awards', accent: 'accent-warning', icon: 'ti ti-trophy', count: 12, label: 'Total Awards' },
  { id: 'gold', accent: 'accent-danger', icon: 'ti ti-medal', count: 3, label: 'Gold Medals' },
  { id: 'certs', accent: 'accent-info', icon: 'ti ti-certificate', count: 8, label: 'Certificates' },
  { id: 'badges', accent: 'accent-purple', icon: 'ti ti-badges', count: 6, label: 'Badges' },
];

const AWARDS = [
  { id: 'olympiad', tone: 'gold', ribbon: '1st', icon: 'ti ti-medal', title: 'Math Olympiad', catIcon: 'ti ti-school', cat: 'Academic · 2024' },
  { id: 'sprint', tone: 'gold', ribbon: 'Gold', icon: 'ti ti-run', title: '100m Sprint', catIcon: 'ti ti-ball-football', cat: 'Sports · Sports Day' },
  { id: 'fair', tone: 'gold', ribbon: '1st', icon: 'ti ti-flask', title: 'Science Fair', catIcon: 'ti ti-school', cat: 'Academic · 2024' },
  { id: 'debate', tone: 'silver', ribbon: '2nd', icon: 'ti ti-microphone-2', title: 'Debate Championship', catIcon: 'ti ti-masks-theater', cat: 'Cultural · 2024' },
  { id: 'spelling', tone: 'bronze', ribbon: '3rd', icon: 'ti ti-vocabulary', title: 'Spelling Bee', catIcon: 'ti ti-masks-theater', cat: 'Cultural · 2024' },
  { id: 'attendance', tone: 'blue', ribbon: 'Cert', icon: 'ti ti-calendar-check', title: 'Perfect Attendance', catIcon: 'ti ti-checks', cat: 'Attendance · Oct' },
];

const RECENT = [
  { id: 'olympiad', tone: 'sub-amber', date: { day: '05', month: 'Dec' }, title: 'Won 1st place — Math Olympiad', detail: 'Inter-School · Academic', pill: 'warn', icon: 'ti ti-medal', status: 'Gold' },
  { id: 'perfect', tone: 'sub-green', date: { day: '01', month: 'Nov' }, title: 'Perfect Attendance Award', detail: 'October · Certificate', pill: 'ok', status: 'Certificate' },
  { id: 'sprint', tone: 'sub-teal', date: { day: '18', month: 'Oct' }, title: 'Gold — 100m Sprint', detail: 'Annual Sports Day · Sports', pill: 'info', icon: 'ti ti-medal', status: 'Gold' },
];

const BADGES = [
  { id: 'b1', cls: 'b-1', icon: 'ti ti-star', label: 'Star Performer' },
  { id: 'b2', cls: 'b-2', icon: 'ti ti-brain', label: 'Quick Learner' },
  { id: 'b3', cls: 'b-3', icon: 'ti ti-friends', label: 'Team Player' },
  { id: 'b4', cls: 'b-4', icon: 'ti ti-book', label: 'Bookworm' },
  { id: 'b5', cls: 'b-5', icon: 'ti ti-target-arrow', label: 'Top Scorer' },
  { id: 'b6', cls: 'b-6', icon: 'ti ti-calendar-star', label: 'Perfect Week' },
];

const AchievementsPane = ({ revealed }: { revealed: boolean }) => (
  <div id="profile-pane-achievements" className="tab-pane-block active" data-pane="achievements" role="tabpanel">
    <div className="fee-stats library-stats mb-4">
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

    <BlockHeading icon="ti ti-trophy">Awards &amp; Honors</BlockHeading>
    <div className="row g-3 mb-4">
      {AWARDS.map((award) => (
        <div className="col-6 col-md-4" key={award.id}>
          <div className={`profile-award ${award.tone}`}>
            <span className="award-ribbon">{award.ribbon}</span>
            <span className="award-medal">
              <i className={award.icon} />
            </span>
            <div className="award-title">{award.title}</div>
            <div className="award-cat">
              <i className={award.catIcon} />
              {award.cat}
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="row g-3">
      <div className="col-md-7">
        <BlockHeading icon="ti ti-sparkles">Recent Achievements</BlockHeading>
        {RECENT.map((item, index) => (
          <ProfileEvent
            key={item.id}
            tone={item.tone}
            className={index < RECENT.length - 1 ? 'mb-2' : ''}
            date={item.date}
            title={item.title}
            detail={item.detail}
            end={
              <span className={`profile-pill ${item.pill} ms-auto`}>
                {item.icon ? <i className={item.icon} /> : null}
                {item.status}
              </span>
            }
          />
        ))}
      </div>

      <div className="col-md-5">
        <BlockHeading icon="ti ti-badges">Earned Badges</BlockHeading>
        <div className="badge-alt-group">
          {BADGES.map((badge) => (
            <div className={`badge-alt ${badge.cls}`} key={badge.id}>
              <span className="avatar avatar-icon avatar-lg avatar-rounded avatar-accent">
                <i className={badge.icon} />
              </span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AchievementsPane;
