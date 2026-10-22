import { Link } from 'react-router-dom';

/** The five pane ids, matching the template's anchors. */
export type TeacherPaneId =
  | 'teacher_details'
  | 'routine'
  | 'leave_attendance'
  | 'salary'
  | 'library';

interface TabItem {
  id: TeacherPaneId;
  icon: string;
  label: string;
}

const TABS: TabItem[] = [
  { id: 'teacher_details', icon: 'ti ti-school', label: 'Teacher Details' },
  { id: 'routine', icon: 'ti ti-table-options', label: 'Routine' },
  { id: 'leave_attendance', icon: 'ti ti-calendar-due', label: 'Leave & Attendance' },
  { id: 'salary', icon: 'ti ti-report-money', label: 'Salary' },
  { id: 'library', icon: 'ti ti-bookmark-edit', label: 'Library' },
];

export interface TeacherDetailsTabRailProps {
  active: TeacherPaneId;
  onChange: (pane: TeacherPaneId) => void;
}

const TeacherDetailsTabRail = ({ active, onChange }: TeacherDetailsTabRailProps) => (
  <div className="card mb-4 sticky-top">
    <div className="card-body py-2 overflow-auto">
      <ul className="nav nav-tabs nav-tabs-bottom mb-0 flex-wrap">
        {TABS.map((tab) => (
          <li key={tab.id}>
            <Link
              to={`#${tab.id}`}
              className={`nav-link${active === tab.id ? ' active' : ''}`}
              onClick={(event) => {
                event.preventDefault();
                onChange(tab.id);
              }}
            >
              <i className={`${tab.icon} me-2`} />
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default TeacherDetailsTabRail;
