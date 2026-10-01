import { BlockHeading, ProfileEvent } from '../primitives';

const TODAY = [
  { id: 'p1', tone: 'sub-blue', now: true, from: '08:00', to: '08:45', icon: 'ti ti-calculator', subject: 'Mathematics', teacher: 'Mr. Teresa Susan', roomIcon: 'ti ti-door', room: 'Room 101', status: 'now', statusLabel: 'Now' },
  { id: 'p2', tone: 'sub-green', from: '08:45', to: '09:30', icon: 'ti ti-flask', subject: 'Science', teacher: 'Ms. Amelia Grant', roomIcon: 'ti ti-door', room: 'Lab 2', status: 'next', statusLabel: 'Next' },
  { id: 'p3', tone: 'sub-purple', from: '09:45', to: '10:30', icon: 'ti ti-book', subject: 'English', teacher: 'Mr. John Reed', roomIcon: 'ti ti-door', room: 'Room 101', status: '', statusLabel: 'Upcoming' },
  { id: 'p4', tone: 'sub-teal', from: '11:00', to: '11:45', icon: 'ti ti-map-2', subject: 'Geography', teacher: 'Ms. Kate Ford', roomIcon: 'ti ti-door', room: 'Room 104', status: '', statusLabel: 'Upcoming' },
  { id: 'p5', tone: 'sub-amber', from: '12:00', to: '12:45', icon: 'ti ti-run', subject: 'Physical Education', teacher: 'Coach Ryan', roomIcon: 'ti ti-map-pin', room: 'Ground', status: '', statusLabel: 'Upcoming' },
];

const PERIOD_HEADS = [
  { id: 'p1', label: 'P1', time: '08:00' },
  { id: 'p2', label: 'P2', time: '08:45' },
  { id: 'p3', label: 'P3', time: '09:45' },
  { id: 'p4', label: 'P4', time: '11:00' },
  { id: 'p5', label: 'P5', time: '12:00' },
];

const WEEK: { day: string; cells: { label: string; cls: string }[] }[] = [
  { day: 'Mon', cells: [{ label: 'Math', cls: 's-math' }, { label: 'Science', cls: 's-sci' }, { label: 'English', cls: 's-eng' }, { label: 'Geo', cls: 's-geo' }, { label: 'PE', cls: 's-pe' }] },
  { day: 'Tue', cells: [{ label: 'English', cls: 's-eng' }, { label: 'Math', cls: 's-math' }, { label: 'History', cls: 's-his' }, { label: 'Free', cls: 'free' }, { label: 'Music', cls: 's-mus' }] },
  { day: 'Wed', cells: [{ label: 'Science', cls: 's-sci' }, { label: 'Math', cls: 's-math' }, { label: 'Geo', cls: 's-geo' }, { label: 'English', cls: 's-eng' }, { label: 'Art', cls: 's-art' }] },
  { day: 'Thu', cells: [{ label: 'Math', cls: 's-math' }, { label: 'History', cls: 's-his' }, { label: 'Science', cls: 's-sci' }, { label: 'PE', cls: 's-pe' }, { label: 'CS', cls: 's-cs' }] },
  { day: 'Fri', cells: [{ label: 'English', cls: 's-eng' }, { label: 'Science', cls: 's-sci' }, { label: 'Math', cls: 's-math' }, { label: 'Geo', cls: 's-geo' }, { label: 'Library', cls: 'free' }] },
];

const LEGEND = [
  { cls: 's-math', label: 'Math' },
  { cls: 's-sci', label: 'Science' },
  { cls: 's-eng', label: 'English' },
  { cls: 's-geo', label: 'Geography' },
  { cls: 's-his', label: 'History' },
  { cls: 's-pe', label: 'PE' },
  { cls: 's-mus', label: 'Music' },
  { cls: 's-art', label: 'Art' },
  { cls: 's-cs', label: 'CS' },
];

const EXAMS = [
  { id: 'math', tone: 'sub-pink', date: { day: '12', month: 'Jan' }, title: 'Final Term — Math', detail: '09:00 AM · Hall A', status: 'In 6 days' },
  { id: 'sci', tone: 'sub-green', date: { day: '14', month: 'Jan' }, title: 'Final Term — Science', detail: '09:00 AM · Lab 2', status: 'In 8 days' },
];

const ASSIGNMENTS = [
  { id: 'algebra', tone: 'sub-amber', icon: 'ti ti-clipboard-list', title: 'Algebra Worksheet 5', detail: 'Due 09 Jan 2025', pill: 'warn', status: 'Pending' },
  { id: 'eco', tone: 'sub-green', icon: 'ti ti-clipboard-check', title: 'Science Project — Ecosystems', detail: 'Submitted 04 Jan 2025', pill: 'ok', status: 'Done' },
];

const TimetablePane = () => (
  <div id="profile-pane-timetable" className="tab-pane-block active" data-pane="timetable" role="tabpanel">
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
      <h6 className="block-heading mb-0">
        <i className="ti ti-clock-hour-4" />
        Today&apos;s Classes <span className="today-chip">Monday · 5 Periods</span>
      </h6>
    </div>

    <div className="profile-schedule mb-4">
      {TODAY.map((period) => (
        <div className={`schedule-item${period.now ? ' now' : ''} ${period.tone}`} key={period.id}>
          <div className="profile-schedule-time">
            <b>{period.from}</b>
            <span>{period.to}</span>
          </div>
          <span className="avatar avatar-icon avatar-accent-soft">
            <i className={period.icon} />
          </span>
          <div className="schedule-body">
            <div className="schedule-subj">{period.subject}</div>
            <div className="profile-schedule-meta">
              <i className="ti ti-user" />
              {period.teacher}
              <i className={`${period.roomIcon} ms-2`} />
              {period.room}
            </div>
          </div>
          <span className={`schedule-status ${period.status}`.trim()}>
            {period.status === 'now' ? <span className="profile-dot" /> : null}
            {period.statusLabel}
          </span>
        </div>
      ))}
    </div>

    <BlockHeading icon="ti ti-table">Weekly Timetable</BlockHeading>
    <div className="timetable-wrap mb-2">
      <table className="profile-timetable">
        <thead>
          <tr>
            <th>Day</th>
            {PERIOD_HEADS.map((head) => (
              <th key={head.id}>
                {head.label}
                <span>{head.time}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {WEEK.map((row) => (
            <tr key={row.day}>
              <th>{row.day}</th>
              {row.cells.map((cell, index) => (
                <td key={`${row.day}-${index}`}>
                  <span className={`tt-chip ${cell.cls}`}>{cell.label}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="timetable-legend mb-4">
      {LEGEND.map((item) => (
        <span key={item.cls}>
          <i className={`tt-key ${item.cls}`} />
          {item.label}
        </span>
      ))}
    </div>

    <div className="row g-3">
      <div className="col-12 col-xl-12">
        <BlockHeading icon="ti ti-notebook">Upcoming Exams</BlockHeading>
        {EXAMS.map((exam, index) => (
          <ProfileEvent
            key={exam.id}
            tone={exam.tone}
            className={index < EXAMS.length - 1 ? 'mb-2' : ''}
            date={exam.date}
            title={exam.title}
            detail={exam.detail}
            end={<span className="profile-pill info ms-auto">{exam.status}</span>}
          />
        ))}
      </div>

      <div className="col-12 col-xl-12">
        <BlockHeading icon="ti ti-checkbox">Assignments &amp; Homework</BlockHeading>
        {ASSIGNMENTS.map((task, index) => (
          <ProfileEvent
            key={task.id}
            tone={task.tone}
            className={index < ASSIGNMENTS.length - 1 ? 'mb-2' : ''}
            icon={task.icon}
            title={task.title}
            detail={task.detail}
            end={<span className={`profile-pill ${task.pill} ms-auto`}>{task.status}</span>}
          />
        ))}
      </div>
    </div>
  </div>
);

export default TimetablePane;
