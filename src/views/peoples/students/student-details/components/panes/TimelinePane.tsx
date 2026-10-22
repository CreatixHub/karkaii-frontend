import { BlockHeading } from '../primitives';

const ENTRIES = [
  { id: 'olympiad', accent: 'accent-success', icon: 'ti ti-trophy', time: '05 Dec 2024', title: 'Achievement Unlocked', desc: 'Won 1st place in the Inter-School Math Olympiad.' },
  { id: 'result', accent: 'accent-primary', icon: 'ti ti-clipboard-check', time: '05 Dec 2024', title: 'Exam Result Published', desc: 'Unit Test III — Scored 460/500 (Grade A+).' },
  { id: 'invoice', accent: 'accent-warning', icon: 'ti ti-cash', time: '01 Dec 2024', title: 'Fee Invoice Generated', desc: 'Term II tuition invoice #INV-2043 of $2,000.' },
  { id: 'book', accent: 'accent-info', icon: 'ti ti-book', time: '28 Nov 2024', title: 'Library Book Issued', desc: '"A Brief History of Time" issued from the library.' },
  { id: 'note', accent: 'accent-teal', icon: 'ti ti-message', time: '22 Nov 2024', title: 'Teacher Note Added', desc: 'Class teacher praised improvement in problem solving.' },
  { id: 'attendance', accent: 'accent-success', icon: 'ti ti-calendar-check', time: '01 Nov 2024', title: 'Perfect Attendance', desc: '100% attendance for the month of October.' },
  { id: 'admission', accent: 'accent-primary', icon: 'ti ti-user-plus', time: '18 Mar 2024', title: 'Admission Completed', desc: 'Enrolled into Class III - A for AY 2024/2025.' },
];

const TimelinePane = () => (
  <div id="profile-pane-timeline" className="tab-pane-block active" data-pane="timeline" role="tabpanel">
    <BlockHeading icon="ti ti-timeline">Activity Timeline</BlockHeading>
    <div className="profile-timeline">
      {ENTRIES.map((entry) => (
        <div className="profile-timeline" key={entry.id}>
          <span className={`avatar avatar-icon avatar-sm avatar-rounded avatar-accent-soft ${entry.accent}`}>
            <i className={entry.icon} />
          </span>
          <div className="profile-timeline-time">{entry.time}</div>
          <div className="timeline-title">{entry.title}</div>
          <div className="timeline-desc">{entry.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

export default TimelinePane;
