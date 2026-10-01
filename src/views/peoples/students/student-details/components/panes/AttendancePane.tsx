import { BarGroup, BlockHeading, Counter, ProfileEvent } from '../primitives';

const STATS = [
  { id: 'present', accent: 'accent-success', icon: 'ti ti-circle-check', count: 184, label: 'Present Days' },
  { id: 'absent', accent: 'accent-danger', icon: 'ti ti-circle-x', count: 4, label: 'Absent Days' },
  { id: 'late', accent: 'accent-warning', icon: 'ti ti-clock-exclamation', count: 2, label: 'Late Arrivals' },
  { id: 'leave', accent: 'accent-info', icon: 'ti ti-plane-departure', count: 3, label: 'On Leave' },
];

const MONTHS = [
  { label: 'Jul', value: 92 },
  { label: 'Aug', value: 88 },
  { label: 'Sep', value: 95 },
  { label: 'Oct', value: 90 },
  { label: 'Nov', value: 97 },
  { label: 'Dec', value: 96 },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Four weeks, in template order. */
const HEATMAP: { cls: string; title: string }[] = [
  { cls: 'l4', title: 'Present' }, { cls: 'l3', title: 'Present' }, { cls: 'l4', title: 'Present' },
  { cls: 'l4', title: 'Present' }, { cls: 'late', title: 'Late' }, { cls: 'l2', title: 'Half day' },
  { cls: 'l1', title: 'Holiday' },
  { cls: 'l4', title: 'Present' }, { cls: 'l4', title: 'Present' }, { cls: 'l3', title: 'Present' },
  { cls: 'l4', title: 'Present' }, { cls: 'l4', title: 'Present' }, { cls: 'l3', title: 'Present' },
  { cls: 'l2', title: 'Holiday' },
  { cls: 'l4', title: 'Present' }, { cls: 'absent', title: 'Absent' }, { cls: 'l4', title: 'Present' },
  { cls: 'l3', title: 'Present' }, { cls: 'l4', title: 'Present' }, { cls: 'l4', title: 'Present' },
  { cls: 'l1', title: 'Holiday' },
  { cls: 'l3', title: 'Present' }, { cls: 'l4', title: 'Present' }, { cls: 'l4', title: 'Present' },
  { cls: 'late', title: 'Late' }, { cls: 'l4', title: 'Present' }, { cls: 'l3', title: 'Present' },
  { cls: 'l2', title: 'Holiday' },
];

const LEAVES = [
  { id: 'oct', tone: 'sub-green', date: { day: '12', month: 'Oct' }, title: 'Sick Leave', detail: '12–13 Oct 2024 · 2 days', pill: 'ok', status: 'Approved' },
  { id: 'sep', tone: 'sub-green', date: { day: '05', month: 'Sep' }, title: 'Family Function', detail: '05 Sep 2024 · 1 day', pill: 'ok', status: 'Approved' },
  { id: 'nov', tone: 'sub-amber', date: { day: '22', month: 'Nov' }, title: 'Casual Leave', detail: '22 Nov 2024 · 1 day', pill: 'warn', status: 'Pending' },
];

const AttendancePane = ({ revealed }: { revealed: boolean }) => (
  <div id="profile-pane-attendance" className="tab-pane-block active" data-pane="attendance" role="tabpanel">
    <div className="row g-3 mb-3 align-items-stretch">
      <div className="col-xl-12 col-md-5">
        <div className="attendance-ringcard">
          <div
            className="ring-track attendance-ring accent-success"
            style={{ ['--val' as string]: revealed ? 96 : 0 }}
          >
            <div className="profile-ring-hole big">
              <span>
                <Counter value={96} suffix="%" revealed={revealed} />
              </span>
              <small>Present Rate</small>
            </div>
          </div>
          <div className="attendance-ringcap">
            <i className="ti ti-calendar-check" />
            <b>184 / 192</b> school days attended
          </div>
        </div>
      </div>

      <div className="col-xl-12 col-md-7">
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

    <div className="profile-tile mb-4">
      <div className="profile-tile-head">
        <BlockHeading icon="ti ti-chart-bar" className="mb-0">
          Monthly Attendance
        </BlockHeading>
        <span className="attendance-avg">
          <i className="ti ti-trending-up" />
          Avg 93% · Trending up
        </span>
      </div>
      <BarGroup bars={MONTHS} revealed={revealed} className="bar-group-target" />
    </div>

    <div className="row g-3">
      <div className="col-xl-12 col-md-7">
        <BlockHeading icon="ti ti-calendar-month" sub="last 4 weeks">
          Attendance Heatmap{' '}
        </BlockHeading>
        <div className="heatmap-block-wrap">
          <div className="heatmap-block-days">
            {DAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="heatmap-block">
            {HEATMAP.map((cell, index) => (
              <div className={`d ${cell.cls}`} title={cell.title} key={index} />
            ))}
          </div>
          <div className="heatmap-block-legend">
            <span>Less</span>
            <span className="k" style={{ background: 'rgba(22,163,74,.25)' }} />
            <span className="k" style={{ background: 'rgba(22,163,74,.5)' }} />
            <span className="k" style={{ background: 'rgba(22,163,74,.75)' }} />
            <span className="k" style={{ background: '#16a34a' }} />
            <span>More</span>
            <span className="ms-2 d-inline-flex align-items-center gap-1">
              <span className="k" style={{ background: 'rgba(217,119,6,.85)' }} />
              Late
            </span>
            <span className="d-inline-flex align-items-center gap-1">
              <span className="k" style={{ background: 'rgba(220,38,38,.8)' }} />
              Absent
            </span>
          </div>
        </div>
      </div>

      <div className="col-xl-12 col-md-5">
        <BlockHeading icon="ti ti-history">Leave History</BlockHeading>
        {LEAVES.map((leave, index) => (
          <ProfileEvent
            key={leave.id}
            tone={leave.tone}
            className={index < LEAVES.length - 1 ? 'mb-2' : ''}
            date={leave.date}
            title={leave.title}
            detail={leave.detail}
            end={<span className={`profile-pill ${leave.pill} ms-auto`}>{leave.status}</span>}
          />
        ))}
      </div>
    </div>
  </div>
);

export default AttendancePane;
