import { useState } from 'react';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { BlockHeading, Counter } from '../primitives';

type AuditCategory = 'profile' | 'fees' | 'academic';

const FILTERS: { id: 'all' | AuditCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'profile', label: 'Profile' },
  { id: 'fees', label: 'Fees' },
  { id: 'academic', label: 'Academic' },
];

const STATS = [
  { id: 'changes', accent: 'accent-info', icon: 'ti ti-pencil', count: 47, label: 'Total Changes' },
  { id: 'editors', accent: 'accent-success', icon: 'ti ti-user-check', count: 6, label: 'Editors' },
  { id: 'last', accent: 'accent-warning', icon: 'ti ti-clock-hour-4', value: '2h', label: 'Last Change' },
  { id: 'verified', accent: 'accent-teal', icon: 'ti ti-shield-check', value: '100%', label: 'Verified' },
];

interface AuditRow {
  id: string;
  category: AuditCategory;
  categoryLabel: string;
  accent: string;
  icon: string;
  title: string;
  detail: { prefix?: string; old?: string; next: string };
  photo: string;
  author: string;
  when: string;
  origin: string;
}

const ROWS: AuditRow[] = [
  {
    id: 'grade',
    category: 'academic',
    categoryLabel: 'Academic',
    accent: 'accent-info',
    icon: 'ti ti-school',
    title: 'Grade updated',
    detail: { prefix: 'Term II Mathematics ', old: 'A', next: 'A+' },
    photo: 'assets/img/teachers/teacher-01.jpg',
    author: 'Mr. Teresa Susan',
    when: 'Today, 12:40 PM',
    origin: '192.168.1.24 · Chrome',
  },
  {
    id: 'payment',
    category: 'fees',
    categoryLabel: 'Fees',
    accent: 'accent-success',
    icon: 'ti ti-cash',
    title: 'Payment recorded',
    detail: { prefix: 'Term I Tuition ', next: '$3,000 · Card ····4521' },
    photo: 'assets/img/profiles/avatar-27.jpg',
    author: 'Accounts Office',
    when: 'Yesterday, 04:15 PM',
    origin: '10.0.0.8 · Edge',
  },
  {
    id: 'phone',
    category: 'profile',
    categoryLabel: 'Profile',
    accent: 'accent-warning',
    icon: 'ti ti-phone',
    title: 'Contact number changed',
    detail: { prefix: 'Guardian phone ', old: '+1 809 095 5400', next: '+1 809 095 5468' },
    photo: 'assets/img/profiles/avatar-01.jpg',
    author: 'Admin · Sarah W.',
    when: '18 Nov 2024, 09:22 AM',
    origin: '192.168.1.10 · Firefox',
  },
  {
    id: 'photo',
    category: 'profile',
    categoryLabel: 'Profile',
    accent: 'accent-purple',
    icon: 'ti ti-photo',
    title: 'Profile photo updated',
    detail: { next: 'New photograph uploaded' },
    photo: 'assets/img/profiles/avatar-01.jpg',
    author: 'Admin · Sarah W.',
    when: '02 Nov 2024, 11:05 AM',
    origin: '192.168.1.10 · Firefox',
  },
  {
    id: 'attendance',
    category: 'academic',
    categoryLabel: 'Academic',
    accent: 'accent-info',
    icon: 'ti ti-calendar-check',
    title: 'Attendance corrected',
    detail: { prefix: '14 Oct 2024 ', old: 'Absent', next: 'On Leave' },
    photo: 'assets/img/teachers/teacher-01.jpg',
    author: 'Mr. Teresa Susan',
    when: '16 Oct 2024, 08:50 AM',
    origin: '192.168.1.24 · Chrome',
  },
];

const AuditPane = ({ revealed }: { revealed: boolean }) => {
  const [filter, setFilter] = useState<'all' | AuditCategory>('all');
  const rows = ROWS.filter((row) => filter === 'all' || row.category === filter);

  return (
    <div id="profile-pane-audit" className="tab-pane-block active" data-pane="audit" role="tabpanel">
      <div className="profile-tile-head mb-3">
        <BlockHeading icon="ti ti-history" className="mb-0" sub="Profile change history">
          Audit Trail{' '}
        </BlockHeading>
        <div className="profile-chip-set">
          {FILTERS.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`profile-chip${filter === item.id ? ' solid' : ''}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
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
                {stat.count !== undefined ? (
                  <Counter value={stat.count} revealed={revealed} />
                ) : (
                  stat.value
                )}
              </div>
              <div className="l">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="profile-audit" id="spAuditList">
        {rows.map((row) => (
          <div className="audit-row" data-cat={row.category} key={row.id}>
            <span className={`avatar avatar-icon avatar-md avatar-accent-soft ${row.accent}`}>
              <i className={row.icon} />
            </span>
            <div className="audit-body">
              <div className="audit-top">
                <b>{row.title}</b>
                <span className={`badge-cat ${row.category}`}>{row.categoryLabel}</span>
              </div>
              <div className="audit-detail">
                {row.detail.prefix}
                {row.detail.old ? (
                  <>
                    <em className="old">{row.detail.old}</em>
                    <i className="ti ti-arrow-right" />
                  </>
                ) : null}
                <em className="new">{row.detail.next}</em>
              </div>
              <div className="audit-meta">
                <ImageWithBasePath src={row.photo} alt={row.author} />
                <span>{row.author}</span>
                <i className="ti ti-point" />
                <span>{row.when}</span>
                <i className="ti ti-point" />
                <span>{row.origin}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="audit-note">
        <i className="ti ti-info-circle" />
        Audit records are immutable and retained for 7 years per school data policy.
      </p>
    </div>
  );
};

export default AuditPane;
