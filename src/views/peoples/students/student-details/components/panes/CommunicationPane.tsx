import { BlockHeading, Counter, ProfileEvent } from '../primitives';
import type { ProfileAction } from '../../data/studentProfileActions';

const QUICK_ACTIONS: { id: ProfileAction; icon: string; label: string }[] = [
  { id: 'message', icon: 'ti ti-message', label: 'Message' },
  { id: 'email', icon: 'ti ti-mail', label: 'Email' },
  { id: 'call', icon: 'ti ti-phone', label: 'Call' },
  { id: 'meeting', icon: 'ti ti-calendar-plus', label: 'Meeting' },
];

const STATS = [
  { id: 'emails', accent: 'accent-info', icon: 'ti ti-mail', count: 12, label: 'Emails' },
  { id: 'messages', accent: 'accent-success', icon: 'ti ti-message', count: 8, label: 'Messages' },
  { id: 'sms', accent: 'accent-warning', icon: 'ti ti-device-mobile', count: 5, label: 'SMS' },
  { id: 'calls', accent: 'accent-teal', icon: 'ti ti-phone', count: 3, label: 'Calls' },
];

const MESSAGES = [
  {
    id: 'fee',
    tint: 'bg-primary-transparent',
    icon: 'ti ti-mail',
    title: 'Term II Fee Reminder',
    date: '01 Dec 2024',
    to: 'To Robert Daniel',
    channel: { label: 'Email', cls: 'email' },
    snippet: 'Gentle reminder that the Term II tuition of $2,000 is due on 25 Dec. Kindly clear the pending amount.',
    pill: 'ok',
    statusIcon: 'ti ti-check',
    status: 'Delivered',
  },
  {
    id: 'ptm',
    tint: 'bg-success-transparent',
    icon: 'ti ti-message',
    title: 'Parent-Teacher Meeting',
    date: '25 Nov 2024',
    to: 'To Sarah Daniel',
    channel: { label: 'Message', cls: 'message' },
    snippet: 'You are invited to the Term II PTM on 28 Nov at 10:00 AM in Room 101 to discuss progress.',
    pill: 'ok',
    statusIcon: 'ti ti-checks',
    status: 'Read',
  },
  {
    id: 'holiday',
    tint: 'bg-warning-transparent',
    icon: 'ti ti-device-mobile',
    title: 'Holiday Notice',
    date: '20 Nov 2024',
    to: 'To Both Parents',
    channel: { label: 'SMS', cls: 'sms' },
    snippet: 'School will remain closed on 22 Nov for the state holiday. Regular classes resume on 23 Nov.',
    pill: 'info',
    statusIcon: 'ti ti-send',
    status: 'Sent',
  },
  {
    id: 'attendance',
    tint: 'bg-teal-transparent',
    icon: 'ti ti-phone',
    title: 'Attendance Follow-up',
    date: '12 Nov 2024',
    to: 'Call to Robert Daniel',
    channel: { label: 'Call · 4m 12s', cls: 'call' },
    snippet: "Discussed Janet's attendance and confirmed the upcoming sick-leave dates.",
    pill: 'ok',
    statusIcon: 'ti ti-phone-check',
    status: 'Completed',
  },
];

const MEETINGS = [
  { id: 'ptm', tone: 'sub-green', date: { day: '28', month: 'Nov' }, title: 'PTM — Term II', detail: 'With Class Teacher · 10:00 AM', status: 'Attended' },
  { id: 'career', tone: 'sub-teal', date: { day: '15', month: 'Sep' }, title: 'Career Guidance', detail: 'With Counsellor · 02:00 PM', status: 'Attended' },
];

const ANNOUNCEMENTS = [
  { id: 'annual', pinned: true, icon: 'ti ti-confetti', title: 'Annual Day — 20 Jan 2025', detail: 'All students to participate' },
  { id: 'winter', pinned: false, icon: 'ti ti-snowflake', title: 'Winter Break: 25–31 Dec', detail: 'School reopens 02 Jan 2025' },
];

export interface CommunicationPaneProps {
  revealed: boolean;
  onAction: (action: ProfileAction) => void;
}

const CommunicationPane = ({ revealed, onAction }: CommunicationPaneProps) => (
  <div
    id="profile-pane-communication"
    className="tab-pane-block active"
    data-pane="communication"
    role="tabpanel"
  >
    <div className="profile-tile-head mb-3">
      <BlockHeading icon="ti ti-mail-opened" className="mb-0" sub="28 interactions">
        Communication Log{' '}
      </BlockHeading>
      <div className="d-flex gap-2 flex-wrap">
        {QUICK_ACTIONS.map((action) => (
          <button
            type="button"
            key={action.id}
            className="profile-button profile-button-sm"
            onClick={() => onAction(action.id)}
          >
            <i className={action.icon} />
            {action.label}
          </button>
        ))}
      </div>
    </div>

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

    <BlockHeading icon="ti ti-messages">Recent Messages &amp; Emails</BlockHeading>
    <div className="msgs mb-4">
      {MESSAGES.map((message) => (
        <div className="profile-message" key={message.id}>
          <span className={`avatar avatar-icon ${message.tint}`}>
            <i className={message.icon} />
          </span>
          <div className="message-main">
            <div className="message-top">
              <b className="message-title">{message.title}</b>
              <span className="message-date">{message.date}</span>
            </div>
            <div className="message-sub">
              {message.to} <span className={`message-chan ${message.channel.cls}`}>{message.channel.label}</span>
            </div>
            <div className="message-snippet">{message.snippet}</div>
          </div>
          <span className={`profile-pill ${message.pill} ms-auto`}>
            <i className={message.statusIcon} />
            {message.status}
          </span>
        </div>
      ))}
    </div>

    <div className="row g-3">
      <div className="col-md-6">
        <BlockHeading icon="ti ti-calendar-event">Meeting History</BlockHeading>
        {MEETINGS.map((meeting, index) => (
          <ProfileEvent
            key={meeting.id}
            tone={meeting.tone}
            className={index < MEETINGS.length - 1 ? 'mb-2' : ''}
            date={meeting.date}
            title={meeting.title}
            detail={meeting.detail}
            end={<span className="profile-pill ok ms-auto">{meeting.status}</span>}
          />
        ))}
      </div>

      <div className="col-md-6">
        <BlockHeading icon="ti ti-speakerphone">Announcements</BlockHeading>
        {ANNOUNCEMENTS.map((item, index) => (
          <div
            className={`announcement${item.pinned ? ' pinned' : ''}${index < ANNOUNCEMENTS.length - 1 ? ' mb-2' : ''}`}
            key={item.id}
          >
            <span className="avatar avatar-icon bg-purple-transparent">
              <i className={item.icon} />
            </span>
            <div className="announcement-body">
              <b>{item.title}</b>
              <div className="profile-timeline-time">{item.detail}</div>
            </div>
            {item.pinned ? <i className="ti ti-pinned announcement-pin" /> : null}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CommunicationPane;
