export type ProfilePaneId =
  | 'overview'
  | 'attendance'
  | 'academics'
  | 'exams'
  | 'fees'
  | 'timetable'
  | 'health'
  | 'library'
  | 'documents'
  | 'timeline'
  | 'achievements'
  | 'discipline'
  | 'communication'
  | 'notes'
  | 'audit';

export const PROFILE_TABS: { id: ProfilePaneId; icon: string; label: string; locked?: boolean }[] = [
  { id: 'overview', icon: 'ti ti-layout-dashboard', label: 'Overview' },
  { id: 'attendance', icon: 'ti ti-calendar-stats', label: 'Attendance' },
  { id: 'academics', icon: 'ti ti-school', label: 'Academics' },
  { id: 'exams', icon: 'ti ti-clipboard-check', label: 'Exams & Results' },
  { id: 'fees', icon: 'ti ti-report-money', label: 'Fees' },
  { id: 'timetable', icon: 'ti ti-table', label: 'Timetable' },
  { id: 'health', icon: 'ti ti-heartbeat', label: 'Health' },
  { id: 'library', icon: 'ti ti-books', label: 'Library' },
  { id: 'documents', icon: 'ti ti-files', label: 'Documents' },
  { id: 'timeline', icon: 'ti ti-timeline', label: 'Timeline' },
  { id: 'achievements', icon: 'ti ti-trophy', label: 'Achievements' },
  { id: 'discipline', icon: 'ti ti-gavel', label: 'Discipline' },
  { id: 'communication', icon: 'ti ti-mail-opened', label: 'Communication' },
  { id: 'notes', icon: 'ti ti-notes', label: 'Notes', locked: true },
  { id: 'audit', icon: 'ti ti-history', label: 'Audit Trail' },
];

export interface ProfileTabsProps {
  active: ProfilePaneId;
  onChange: (pane: ProfilePaneId) => void;
}

const ProfileTabs = ({ active, onChange }: ProfileTabsProps) => {
  const move = (index: number, step: number) => {
    const next = (index + step + PROFILE_TABS.length) % PROFILE_TABS.length;
    onChange(PROFILE_TABS[next].id);
    document.getElementById(`profile-tab-${PROFILE_TABS[next].id}`)?.focus();
  };

  return (
    <div className="tab-list" role="tablist" aria-label="Profile sections">
      {PROFILE_TABS.map((tab, index) => (
        <button
          type="button"
          key={tab.id}
          id={`profile-tab-${tab.id}`}
          className={`profile-tab${active === tab.id ? ' active' : ''}`}
          role="tab"
          aria-controls={`profile-pane-${tab.id}`}
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              move(index, 1);
            }
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              move(index, -1);
            }
          }}
        >
          <i className={tab.icon} />
          {tab.label}
          {tab.locked ? (
            <span className="tab-lock" title="Staff only">
              <i className="ti ti-lock" />
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
